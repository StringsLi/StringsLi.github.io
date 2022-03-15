#### 1. 简介

本文主要介绍6种postgresql数据的插入方式的效率；

数据采用python faker包生成的假数据，样式如下：

一条数据如下：谭磊	湖南省兴安盟县孝南关岭路q座 578703	南京市	MMTE96835803777282	维旺明科技有限公司	341102209612219	VISA 13 digit	2005-09-28	13168174481

生成代码如下：

```python
from faker import Faker
fake = Faker(locale='zh_CN')


def fake_row(i):
    row = [fake.name(), fake.address(), fake.city(), fake.bban(),
           fake.company(), fake.credit_card_number(card_type=None), fake.credit_card_provider(card_type=None),
           fake.date(pattern="%Y-%m-%d", end_datetime=None), fake.phone_number()]
    return row


start = time.time()
fake_data = [fake_row(i) for i in range(1000000)]
data = pd.DataFrame(fake_data)
data.columns = ["col{}".format(i) for i in range(1, 10)]
print(data)
```





```python
from sqlalchemy import create_engine
import pandas as pd
import time
import io
import codecs
import csv
from psycopg2 import extras as ex
from faker import Faker


def coast_time(func):
    def fun(*args, **kwargs):
        t = time.perf_counter()
        result = func(*args, **kwargs)
        print(f'func {func.__name__} need time:{time.perf_counter() - t:.2f} s')
        return result

    return fun


def psql_insert_copy(table, conn, keys, data_iter):
    dbapi_conn = conn.connection
    with dbapi_conn.cursor() as cur:
        s_buf = io.StringIO()
        writer = csv.writer(s_buf)
        writer.writerows(data_iter)
        s_buf.seek(0)

        columns = ', '.join('"{}"'.format(k) for k in keys)
        if table.schema:
            table_name = '{}.{}'.format(table.schema, table.name)
        else:
            table_name = table.name

        sql = 'COPY {} ({}) FROM STDIN WITH CSV'.format(
            table_name, columns)
        cur.copy_expert(sql=sql, file=s_buf)


@coast_time
def copy_insert(engine, data, table_name):
    conn = engine.raw_connection()
    cur = conn.cursor()
    output = io.StringIO()
    data.to_csv(output, sep='\t', header=False, index=False)
    output.seek(0)
    cur.copy_from(output, table_name, null="")
    conn.commit()


@coast_time
def copy_insert_sql(engine, data, table_name):
    conn = engine.raw_connection()
    cur = conn.cursor()
    columns = data.columns
    str_cols = ",".join(columns)
    f = io.BytesIO()

    StreamWriter = codecs.getwriter("utf-8")
    csv_writer = csv.writer(StreamWriter(f))
    for row in data.values:
        csv_writer.writerow([_ for _ in row])
    f.seek(0)
    cur.copy_expert(sql="copy {}({}) from stdin WITH (FORMAT CSV)".format(table_name, str_cols), file=f)
    conn.commit()


@coast_time
def insert_many(engine, data, table_name):
    columns = data.columns
    str_cols = ",".join(columns)
    str_sss = ','.join(len(columns) * ['%s'])
    sql_query = """INSERT INTO {}({}) VALUES ({});""".format(table_name, str_cols, str_sss)
    data_list = [tuple(x) for x in data.values]
    conn = engine.raw_connection()
    cur = conn.cursor()
    cur.executemany(sql_query, data_list)
    conn.commit()


@coast_time
def insert_values(engine, data, table_name):
    columns = data.columns
    str_cols = ",".join(columns)
    sql_query = """INSERT INTO {}({}) VALUES %s;""".format(table_name, str_cols)
    data_list = [tuple(x) for x in data.values]
    conn = engine.raw_connection()
    cur = conn.cursor()
    ex.execute_values(cur, sql_query, data_list, page_size=10000)
    conn.commit()


@coast_time
def to_sql_insert_normal(engine, data, table_name):
    data.to_sql(table_name, engine, index=False, if_exists='replace')


@coast_time
def to_sql_insert_copy(engine, data, table_name):
    data.to_sql(table_name, engine, method=psql_insert_copy, index=False, if_exists='replace')


user = 'postgres'
password = '121457'
host = '127.0.0.1'
port = '5432'
database_name = 'test_data_base'

database_url = 'postgresql+psycopg2://{user}:{password}@{host}:{port}/{database_name}?client_encoding=utf8'.format(
    user=user,
    host=host,
    port=port,
    password=password,
    database_name=database_name,
)

engine = create_engine(database_url)
fake = Faker(locale='zh_CN')


def fake_row(i):
    row = [fake.name(), fake.address(), fake.city(), fake.bban(),
           fake.company(), fake.credit_card_number(card_type=None), fake.credit_card_provider(card_type=None),
           fake.date(pattern="%Y-%m-%d", end_datetime=None), fake.phone_number()]
    return row


start = time.time()
fake_data = [fake_row(i) for i in range(1000000)]
data = pd.DataFrame(fake_data)
data.columns = ["col{}".format(i) for i in range(1, 10)]
print("func generate data need:{:.2f}秒".format(time.time() - start))

insert_many(engine, data, "tb_faker1")
insert_values(engine, data, "tb_faker2")
copy_insert(engine, data, "tb_faker3")
copy_insert_sql(engine, data, "tb_faker4")
to_sql_insert_normal(engine, data, "tb_faker5")
to_sql_insert_copy(engine, data, "tb_faker6")

```



50万数据的结果如下：

```
func insert_many need time:95.0008 s
func insert_values need time:19.6026 s
func copy_insert need time:7.7923 s
func copy_insert_sql need time:9.4167 s
func to_sql_insert_normal need time:117.4498 s
func to_sql_insert_copy need time:9.9843 s
```



100万数据的结果如下：

```
func generate data need:340.35秒
func insert_many need time:103.80 s
func insert_values need time:19.59 s
func copy_insert need time:7.57 s
func copy_insert_sql need time:9.39 s
func to_sql_insert_normal need time:124.07 s
func to_sql_insert_copy need time:8.87 s
```

