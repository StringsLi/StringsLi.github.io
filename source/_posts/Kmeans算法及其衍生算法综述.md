本文主要介绍Kmeans相关算法。



#### 1 Kmeans聚类

K-Means的思想十分简单，首先随机指定类中心，根据样本与类中心的远近划分类簇，接着重新计算类中心，迭代直至收敛：

假设输入空间 $\cal X \in \R^n \ $ 为$\ n\ $维向量的集合，$\ \cal{X}=\{x^{(1)} ,x^{(2)},\cdots,x^{(m)} \} \ $，$ \ \mathcal  C\ $为输入空间$\ \cal X\ $的一个划分，不妨令$\ \mathcal C=\{ \mathbb C_1,\mathbb C_2,\cdots,\mathbb C_K \} \ $，因此可以定义$\ k\text{-}means\ $算法的损失函数为
$$
J(\mathcal C)=\sum\limits_{k=1}^K\sum\limits_{x^{(i)}\in \mathbb C_k}\Vert x^{(i)}-\mu^{(k)} \Vert_2^2  \tag{1}
$$
其中$\ \mu^{(k)}=\frac{1}{\vert \mathbb C_k \vert}\sum\limits_{x^{(i)}\in\mathbb C_k}x^{(i)}  \ $是簇$\ \mathbb C_k\ $的聚类中心。

事实上，若将样本的类别看做为“隐变量”（latent variable），类中心看作样本的分布参数，这一过程正是通过EM算法的两步走策略而计算出，其根本的目的是为了最小化平方误差函数$J(\mathcal C)$

##### 1.1 算法流程

1. 首先随机初始化$\ K\ $个聚类中心，$\ \mu^{(1)},\mu^{(2)},\cdots,\mu^{(K)} \ $；

2. 然后根据这$\ K\ $个聚类中心给出输入空间$\ \mathcal X \ $的一个划分，$\ \mathbb C_1,\mathbb C_2,\cdots,\mathbb C_K \ $；

   - 样本离哪个簇的聚类中心最近，则该样本就划归到那个簇
     $$
     \mathop{\arg\min}_{k}\ \Vert x^{(i)}-\mu^{(k)} \Vert_2^2 \tag{2}
     $$

3. 再根据这个划分来更新这$\ K\ $个聚类中心
   $$
   \mu^{(k)}=\frac{1}{\vert \mathbb C_k \vert}\sum\limits_{x^{(i)}\in\mathbb C_k}x^{(i)} \tag{3}
   $$

4. 重复2、3步骤直至收敛

   - 即$\ K\ $个聚类中心不再变化

K-means代码地址如下：

https://github.com/StringsLi/ml_scratch_scala/blob/master/src/main/scala/com/strings/model/cluster/Kmeans.scala

#### 2 K-Means++聚类算法

K-Means聚类算法原理中可知，K-means聚类算法首先需要初始化k个聚类中心。但是K-means算法存在一个巨大的缺陷-收敛情况严重依赖聚类中心的初始化情况。当不小心把所有的k个聚类中心初始化到一个类中，K-means算法很难收敛，情况变得很糟糕。所以在改进K-means算法初始化聚类中心方法，引入一种K-means++聚类算法，中心思想是：**逐个选取$k$个聚类中心，且离其他聚类中心越远的样本点越有可能被选为下一个聚类中心。**

算法流程：

> 1. 在数据集中，随机选取一点，作为第一个聚类中心;
>
> 2. 迭代数据中的所有点，计算所有点到最近的聚类中心的距离$D(x)$(具体实现分别计算所有点到每类聚类中心的距离，选择最短的距离作为所有点到最近聚类中心的距离)；
>    $$
>    P(x) = \frac{D(x)^2}{\sum_{x \in X}D(x) ^ 2} \label{4}
>    $$
>    
>
> 3. 选取距离较大的点作为新的聚类中心；
>
> 4. 重复2和3直到选择出K个聚类中心点;
>
> 5. 用这k个聚类中心作为初始化质心去运行标准的K-Means算法;

详细scala实现代码如下：

https://github.com/StringsLi/ml_scratch_scala/blob/master/src/main/scala/com/strings/model/cluster/KmeansPlus.scala

#### 3. BisectingKMeans-二分Kmeans聚类算法

为了克服k-均值算法收敛于局部最小值的问题，有人提出了另一个称为二分K-均值的算法。

二分k-均值算法思想：

> 1. 首先将所有点作为一个簇，
>
> 2. 将该簇一分为二;
> 3. 之后选择其中一个簇继续进行划分，选择哪个簇继续划分取决于对其划分是否可以最大程度降低SSE的值。上述基于SSE的划分过程不断重复，直到得到用户指定的簇数目为止

详细scala代码如下：

https://github.com/StringsLi/ml_scratch_scala/blob/master/src/main/scala/com/strings/model/cluster/BisectingKMeans.scala



#### 4. FuzzyCMeans 模糊均值聚类算法

 模糊c均值聚类较于k-means的硬聚类，模糊c提供了更加灵活的聚类结果。因为大部分情况下，数据集中的对象不能划分成为明显分离的簇，指派一个对象到一个特定的簇有些生硬，也可能会出错。所以对每个对象和每个簇赋予一个权值，指明对象属于该簇的程度。当然，基于概率的方法也可以给出这样的权值，但是有时候我们很难确定一个合适的统计模型，因此使用具有自然地、非概率特性的模糊c均值就是一个比较好的选择。

算法的主要思想是：**给每个样本赋予属于每个簇的隶属度函数。通过隶属度值大小来将样本归类。**

**算法的步骤：**

1. 初始化隶属度$U=[u_{ij}]$矩阵，其中$u_{ij}$表示样本$x_i$属于$j$类的隶属度，对单个样本$x_i$，它对于每个簇的隶属度之和为1。

2. 第$k$步，基于隶属度矩阵$U$计算聚类中心$C^k = [c_j]$
   $$
   c_j = \frac{\sum_{i=1}^{N}u_{ij}^m x_i}{\sum_{i=1}^{N}u_{ij}^m} \label{5}
   $$

3. 更新$U^k$ 和 $U^{k+1}$
   $$
   u_{ij} = \frac{1}{\sum_{k=1}^C(\frac{||x_i-c_j||}{||x_i-c_k||})^{\frac{2}{m-1}}}
   $$

4. 如果$||U^{k+1} - U^{k}|| < \epsilon $,Stop，否则返回步骤2.

   注：迭代的终止条件为：$max_{ij}\{|u_{ij}^{k+1} - u_{ij}^{k}|\} < \epsilon$

scala 代码实现如下：

https://github.com/StringsLi/ml_scratch_scala/blob/master/src/main/scala/com/strings/model/cluster/FuzzyCMeans.scala



#### 5. KMedian 聚类算法

算法流程：

1. 首先随机初始化$\ K\ $个聚类中心，$\ \mu^{(1)},\mu^{(2)},\cdots,\mu^{(K)} \ $；

2. 然后根据这$\ K\ $个聚类中心给出输入空间$\ \mathcal X \ $的一个划分，$\ \mathbb C_1,\mathbb C_2,\cdots,\mathbb C_K \ $；

   - 样本离哪个簇的聚类中心最近，则该样本就划归到那个簇（**计算样本和中心点之间的距离使用的是曼哈顿距离**，**而K-Means聚类算法使用的欧式距离**。
     $$
     \mathop{\arg\min}_{k}\ \Vert x^{(i)}-\mu^{(k)} \Vert \tag{2}
     $$

3. 再根据这个划分来更新这$\ K\ $个聚类中心
   $$
   \mu^{(k)}=\frac{1}{\vert \mathbb C_k \vert}\sum\limits_{x^{(i)}\in\mathbb C_k}x^{(i)} \tag{3}
   $$

4. 重复2、3步骤直至收敛

   - 即$\ K\ $个聚类中心不再变化

scala 代码地址为：https://github.com/StringsLi/ml_scratch_scala/blob/master/src/main/scala/com/strings/model/cluster/KMedian.scala



#### 6. KMedoid 聚类算法

与K-means算法类似，区别在于中心点的选取，K-means中选取的中心点为当前类中所有点的重心，而K-medoids法选取的中心点为当前cluster中存在的一点，准则函数是当前cluster中所有其他点到该中心点的距离之和最小，这就在一定程度上削弱了异常值的影响，但缺点是计算较为复杂，耗费的计算机时间比K-means多。

算法流程如下：

>1.在总体$n$个样本点中任意选取k个点作为medoids
>
>2.按照与medoids最近的原则，将剩余的$n-k$个点分配到当前最佳的medoids代表的类中
>
>3.对于第$i$个类中除对应medoids点外的所有其他点，按顺序计算当其为新的medoids时，准则函数的值，遍历所有可能，选取准则函数最小时对应的点作为新的medoids
>
>4.重复2-3的过程，直到所有的medoids点不再发生变化或已达到设定的最大迭代次数
>
>5.产出最终确定的$k$个类;

代码地址：

https://github.com/StringsLi/ml_scratch_scala/blob/master/src/main/scala/com/strings/model/cluster/KMedoid.scala



#### 7 SpectralClustering 谱聚类算法

​      谱聚类是从图论中演化出来的算法，主要思想是把所有的数据看做空间中的点，这些点之间可以用边连接起来。距离较远的两个点之间的边权重值较低，而距离较近的两个点之间的边权重值较高，通过对所有数据点组成的图进行切图，让切图后不同的子图间边权重和尽可能的低，而子图内的边权重和尽可能的高，从而达到聚类的目的。

算法步骤如下：

最常用的相似矩阵的生成方式是基于高斯核距离的全连接方式

>1) 根据输入的相似矩阵的生成方式构建样本的相似矩阵$S$;
>
>2) 根据相似矩阵S构建邻接矩阵$W$，构建度矩阵$D$;
>
>3) 计算出标准化的拉普拉斯矩阵$L = I- D^{-1}W$ ;
>
>4) 计算矩阵$L$的$k$个最小特征值对应的$n$维特征向量$v_1,...,v_k$，通过下式求解特征向量：
>$$
>Lv = \lambda Dv
>$$
>5) $k$个$n$维特征向量$v_1,...,v_k$组成$n×k$维的矩阵$M$；
>
>6）每一行表示一个样本，对该$n$个样本进行$k$均值聚类算法，得到聚类结果$C_1,...,C_k$;

代码地址如下：

https://github.com/StringsLi/ml_scratch_scala/blob/master/src/main/scala/com/strings/model/cluster/SpectralClustering.scala

