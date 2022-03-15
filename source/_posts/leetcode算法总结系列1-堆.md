

### Leetcode算法总结系列1-堆

[TOC]

##### 1.0 堆的介绍

堆（Heap）是一个可以被看成近似完全二叉树的数组。树上的每一个结点对应数组的一个元素。除了最底层外，该树是完全充满的，而且是从左到右填充。—— 来自：《算法导论》

堆包括最大堆和最小堆：最大堆的每一个节点（除了根结点）的值不大于其父节点；最小堆的每一个节点（除了根结点）的值不小于其父节点。

堆常见的操作：

HEAPIFY 建堆：把一个乱序的数组变成堆结构的数组，时间复杂度为 $O(n)$。
HEAPPUSH：把一个数值放进已经是堆结构的数组中，并保持堆结构，时间复杂度为 $O(log\ n)$。
HEAPPOP：从最大堆中取出最大值或从最小堆中取出最小值，并将剩余的数组保持堆结构，时间复杂度为 $O(log\ n)$。
HEAPSORT：借由 HEAPFY 建堆和 HEAPPOP 堆数组进行排序，时间复杂度为 $O(n\ log\ n)$，空间复杂度为 $O(1)$。
堆结构的一个常见应用是建立优先队列（Priority Queue）。

##### 1.1 前K个高频单词

id：692

url：https://leetcode-cn.com/problems/top-k-frequent-words/

描述：

给一非空的单词列表，返回前 k 个出现次数最多的单词。

返回的答案应该按单词出现频率由高到低排序。如果不同的单词有相同出现频率，按字母顺序排序。

示例 1：

输入: ["i", "love", "leetcode", "i", "love", "coding"], k = 2
输出: ["i", "love"]
解析: "i" 和 "love" 为出现次数最多的两个单词，均为2次。
    注意，按字母顺序 "i" 在 "love" 之前。



算法：

1. 计算每个单词的频率，然后将其添加到存储到大小为 k 的小根堆中。它将频率最小的候选项放在堆的顶部。最后，我们从堆中弹出最多 k 次，并反转结果，就可以得到前 k 个高频单词。
2. 在 Python 中，我们使用 heapq\heapify，它可以在线性时间内将列表转换为堆，从而简化了我们的工作。

```java
package com.strings.leetcode.heap;

import java.util.*;

public class Problem_692_topKFrequent {
    public static List<String> topKFrequent(String[] words, int k){
        Map<String,Integer> countMap = new HashMap<String, Integer>();
        for(String word:words){
            countMap.put(word,countMap.getOrDefault(word,0)+1);
        }

        PriorityQueue<String> queue = new PriorityQueue<String>(
                (o1, o2) -> countMap.get(o1) == countMap.get(o2)?
                        o2.compareTo(o1):countMap.get(o1) - countMap.get(o2)
        );

        for(String word:countMap.keySet()){
            queue.offer(word);
            if(queue.size() > k){
                queue.poll();
            }
        }

        List<String> ans = new ArrayList<>();
        while (!queue.isEmpty()){
            ans.add(queue.poll());
        }
        Collections.reverse(ans);
        return ans;

    }

    public static void main(String[] args) {
        String[] words = {"i", "love", "leetcode", "i", "love", "coding"};
        topKFrequent(words,2);
    }
}

```

复杂度分析

时间复杂度： $O(N \log{k})$。其中 $N$ 是 words 的长度。我们用 $O(N)$的时间计算每个单词的频率，然后将 $N$ 个单词添加到堆中，添加每个单词的时间为 $O(\log {k})$ 。最后，我们从堆中弹出最多 $k$ 次。因为 $k \leq N$ 的值，总共是 $O(N \log{k})$
空间复杂度：$O(N)$,用于存储我们计数的空间



```python
from collections import Counter
import heapq
class Solution:
    def topKFrequent(self, words: List[str], k: int) -> List[str]:
        count = Counter(words)
        return heapq.nsmallest(k,count,lambda i: (-count[i], i))
```



##### 1.2 [前 K 个高频元素](https://leetcode-cn.com/problems/top-k-frequent-elements/)

id:347

给定一个非空的整数数组，返回其中出现频率前 **k** 高的元素。

**示例 1:**

```text
输入: nums = [1,1,1,2,2,3], k = 2
输出: [1,2]
```

- 你可以假设给定的 *k* 总是合理的，且 1 ≤ k ≤ 数组中不相同的元素的个数。
- 你的算法的时间复杂度**必须**优于 O(*n* log *n*) , *n* 是数组的大小。



```java
class Solution {
    public List<Integer> topKFrequent(int[] nums, int k) {
        Map<Integer,Integer> count = new HashMap<>();
        for(int n:nums){
            count.put(n,count.getOrDefault(n,0) + 1);
        }

        PriorityQueue<Integer> queue = new PriorityQueue<>((o1,o2) -> count.get(o1) - count.get(o2));

        for(Integer i: count.keySet()){
            queue.add(i);
            while (queue.size() > k){
                queue.poll();
            }
        }

        List<Integer> res = new ArrayList<>();
        while (!queue.isEmpty()){
            res.add(queue.poll());
        }
        Collections.reverse(res);
        return res;
    }
}
```

```python
from typing import List
from collections import Counter
import heapq
class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        count = Counter(nums)
        return heapq.nlargest(k, count.keys(), count.get)
```

##### 1.3 [ 数组中的第K个最大元素](https://leetcode-cn.com/problems/kth-largest-element-in-an-array/)

id:215

在未排序的数组中找到第 k 个最大的元素。请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。

示例 1:

输入: [3,2,1,5,6,4] 和 k = 2
输出: 5

```java
class Solution {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> queue = new PriorityQueue<>(Comparator.comparingInt(n -> n));

        for(int n:nums){
            queue.add(n);
            if(queue.size() > k){
                queue.poll();
            }
        }
        return queue.poll();
    }
}
```



```python
class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        return heapq.nlargest(k,nums)[-1]
```

##### 1.4  [面试题40. 最小的k个数](https://leetcode-cn.com/problems/zui-xiao-de-kge-shu-lcof/)

输入整数数组 arr ，找出其中最小的 k 个数。例如，输入4、5、1、6、2、7、3、8这8个数字，则最小的4个数字是1、2、3、4。

 

示例 1：

输入：arr = [3,2,1], k = 2
输出：[1,2] 或者 [2,1]

```java
package com.strings.leetcode.heap;

import java.util.*;

public class Problem_40_mian_getLeastNumbers {

    public static int[]  getLeastNumbers(int[] arr, int k) {
        if(k == 0) return new int[0];
        PriorityQueue<Integer> priorityQueue = new PriorityQueue<>((a, b) -> (b -a));
        for(int i: arr){
            if(priorityQueue.size() < k){
                priorityQueue.add(i);
            }else{
                if(priorityQueue.peek() > i){
                    priorityQueue.remove();
                    priorityQueue.add(i);
                }
            }
        }

        int[] res = new int[k];
        int count = 0;
        while (priorityQueue.size() > 0){
            res[count++] = priorityQueue.remove();
        }
        return res;
    }

    public static int[] getLeastNumbers2(int[] arr, int k) {
        if(k == 0 || arr.length == 0){
            return new int[0];
        }
        PriorityQueue<Integer> heap = new PriorityQueue<>((o1, o2) -> o2 - o1);

        for(int i:arr){
            heap.offer(i);
            if(heap.size() > k){
                heap.poll();
            }
        }

        int[] res = new int[k];
        int count = 0;
        while (!heap.isEmpty()){
            res[count++] = heap.poll();
        }
        return res;
    }

    public static void main(String[] args) {
        int[] arr = {3,2,1};
        System.out.println(Arrays.toString(getLeastNumbers2(arr,2)));
        System.out.println(Arrays.toString(getLeastNumbers(arr,2)));
    }
}

```

```scala
    def getLeastNumbers(arr: Array[Int], k: Int): Array[Int] = {
        val heap = scala.collection.mutable.PriorityQueue.empty[Int].reverse
        arr.foreach(x => heap.enqueue(x))
        (0 until k).map(_ => heap.dequeue()).toArray
    }
```

##### 1.5 [最接近原点的 K 个点](https://leetcode-cn.com/problems/k-closest-points-to-origin/)

id：973

我们有一个由平面上的点组成的列表 `points`。需要从中找出 `K` 个距离原点 `(0, 0)` 最近的点。

（这里，平面上两点之间的距离是欧几里德距离。）

你可以按任何顺序返回答案。除了点坐标的顺序之外，答案确保是唯一的。

 

**示例 1：**

```
输入：points = [[1,3],[-2,2]], K = 1
输出：[[-2,2]]
解释： 
(1, 3) 和原点之间的距离为 sqrt(10)，
(-2, 2) 和原点之间的距离为 sqrt(8)，
由于 sqrt(8) < sqrt(10)，(-2, 2) 离原点更近。
我们只需要距离原点最近的 K = 1 个点，所以答案就是 [[-2,2]]。
```

二、大根堆(前 K 小) / 小根堆（前 K 大),Java中有现成的 PriorityQueue，实现起来最简单：$O(NlogK)$
本题是求前 K 小，因此用一个容量为 K 的大根堆，每次 poll 出最大的数，那堆中保留的就是前 K 小啦（注意不是小根堆！小根堆的话需要把全部的元素都入堆，那是 O(NlogN)O(NlogN)😂，就不是 O(NlogK)O(NlogK)啦～～）
这个方法比快排慢，但是因为 Java 中提供了现成的 PriorityQueue（默认小根堆），所以实现起来最简单，没几行代码

```java

package com.strings.leetcode.heap;

import scala.actors.threadpool.Arrays;

import java.util.PriorityQueue;

public class Problem_973j_kClosest {
    public static int[][] kClosest(int[][] points, int K) {
        if(K == 0 || points.length == 0){
            return new int[0][0];
        }
        PriorityQueue<int[]> heap = new PriorityQueue<>((o1, o2) ->
                o2[0]*o2[0] + o2[1]*o2[1] - o1[0]*o1[0] - o1[1]*o1[1]
        );

        for(int[] p:points){
            heap.offer(p);
            if(heap.size() > K){
                heap.poll();
            }
        }
        int[][] res = new int[K][2];
        int count = 0;
        for(int[] i:heap){
            res[count++] = i;
        }
        return res;
    }

    public static void main(String[] args) {
        int[][] points = {{1,3},{-2,2}};
        int K = 1;
        System.out.println(Arrays.deepToString(kClosest(points,1)));
    }
}
```

```python
class Solution:
    def kClosest(self, points: List[List[int]], K: int) -> List[List[int]]:
        return heapq.nsmallest(K, points, key = lambda point: point[0] ** 2 + point[1] ** 2 )
```

```scala
object Solution {
  def diff(arr: Array[Int]) = -arr(0)*arr(0) - arr(1)*arr(1)
  def kClosest(points: Array[Array[Int]], K: Int): Array[Array[Int]] = {
    val heap = scala.collection.mutable.PriorityQueue[Array[Int]]()(Ordering.by(diff))
    points.foreach(x => heap.enqueue(x))
    (0 until K).map(_ => heap.dequeue()).toArray
  }
}
```



##### 1.6 [查找和最小的K对数字](https://leetcode-cn.com/problems/find-k-pairs-with-smallest-sums/)

id：373.

给定两个以升序排列的整形数组 **nums1** 和 **nums2**, 以及一个整数 **k**。

定义一对值 **(u,v)**，其中第一个元素来自 **nums1**，第二个元素来自 **nums2**。

找到和最小的 k 对数字 **(u1,v1), (u2,v2) ... (uk,vk)**。

**示例 1:**

```
输入: nums1 = [1,7,11], nums2 = [2,4,6], k = 3
输出: [1,2],[1,4],[1,6]
解释: 返回序列中的前 3 对数：
     [1,2],[1,4],[1,6],[7,2],[7,4],[11,2],[7,6],[11,4],[11,6]
```

```scala
class Solution {
    public List<List<Integer>> kSmallestPairs(int[] nums1, int[] nums2, int k) {
      List<List<Integer>> pair = new ArrayList<>();
        for (int i = 0; i < nums1.length ; i++) {
            for (int j = 0; j < nums2.length; j++) {
                List<Integer> res = new ArrayList<>();
                res.add(nums1[i]);
                res.add(nums2[j]);
                pair.add(res);
            }
        }

        PriorityQueue<List<Integer>> heap = new PriorityQueue<>((o1, o2) ->
                o2.get(0) + o2.get(1) - o1.get(0) - o1.get(1)
                );

        for(List<Integer> lst:pair){
            heap.offer(lst);
            if(heap.size() > k){
                heap.poll();
            }
        }
        List<List<Integer>> ans = new ArrayList<>();
        if(k==0 || nums1.length==0 || nums2.length == 0){
            return ans;
        }
        for(List<Integer> lst:heap){
            ans.add(lst);
        }
        return ans;

    }
}
```

```scala
import scala.collection.mutable.ArrayBuffer

object Solution {
    def diff(num: List[Int]) = {-num(0) - num(1)}
    def kSmallestPairs(nums1: Array[Int], nums2: Array[Int], k: Int): List[List[Int]] = {
        if(k==0||nums1.length== 0){ List()}
        else{
        val pair:ArrayBuffer[List[Int]] = new ArrayBuffer[List[Int]]()
        for(i <- 0 until nums1.length){
            for(j <- 0 until nums2.length){
                pair.append(List(nums1(i),nums2(j)))
            }
        }
        val heap = scala.collection.mutable.PriorityQueue[List[Int]]()(Ordering.by(diff))
        pair.toArray.foreach(x => heap.enqueue(x))
        var tmpk= k
        if(heap.size < k){
            tmpk = heap.size
        }
        (0 until tmpk).map(_ => heap.dequeue()).toList
        }

    }
}
```

##### 1.7  [数据流中的中位数](https://leetcode-cn.com/problems/shu-ju-liu-zhong-de-zhong-wei-shu-lcof/)

###### [数据流的中位数](https://leetcode-cn.com/problems/find-median-from-data-stream/)

###### [连续中值](https://leetcode-cn.com/problems/continuous-median-lcci/)

这三个题都是一样的。

将输入的数分成两部分：较小的一部分和较大的一部分

1. lowPart ：定义为较小的一部分，用最大堆
   允许lowPart的大小比highPart多1
2. highPart ： 定义为较大的一部分，用最小堆
   如果size是奇数，那么中位数就是lowPart的最大值，也就是堆顶

否则，最大值是lowPart和highPart的堆顶平均值

维护

每进入一个数，先加入lowPart，然后将lowPart的最大值（堆顶）移出到highPart

如果这时size是奇数，此时highPart将最小值移出到lowPart



```java
class MedianFinder {

        private PriorityQueue<Integer> lowPart;
    private PriorityQueue<Integer> highPart;
    int size;
    /** initialize your data structure here. */
    public MedianFinder() {
        lowPart = new PriorityQueue<Integer>((x, y) -> y - x);  //最大堆
        highPart = new PriorityQueue<Integer>();
        size = 0;
    }

    public void addNum(int num) {
        size++;
        lowPart.offer(num);
        highPart.offer(lowPart.poll());
        if((size & 1) == 1){
            lowPart.offer(highPart.poll());
        }
    }

    public double findMedian() {
        if((size & 1) == 1){
            return (double) lowPart.peek();
        }else{
            return (double) (lowPart.peek() + highPart.peek()) / 2;
        }
    }
}

/**
 * Your MedianFinder object will be instantiated and called as such:
 * MedianFinder obj = new MedianFinder();
 * obj.addNum(num);
 * double param_2 = obj.findMedian();
 */
```

```python
class MedianFinder:

    def __init__(self):
        # 当前大顶堆和小顶堆的元素个数之和
        self.count = 0
        self.max_heap = []
        self.min_heap = []

    def addNum(self, num: int) -> None:
        self.count += 1
        # 因为 Python 中的堆默认是小顶堆，所以要传入一个 tuple，用于比较的元素需是相反数，
        # 才能模拟出大顶堆的效果
        heapq.heappush(self.max_heap, (-num, num))
        _, max_heap_top = heapq.heappop(self.max_heap)
        heapq.heappush(self.min_heap, max_heap_top)
        if self.count & 1:
            min_heap_top = heapq.heappop(self.min_heap)
            heapq.heappush(self.max_heap, (-min_heap_top, min_heap_top))

    def findMedian(self) -> float:
        if self.count & 1:
            # 如果两个堆合起来的元素个数是奇数，数据流的中位数大顶堆的堆顶元素
            return self.max_heap[0][1]
        else:
            # 如果两个堆合起来的元素个数是偶数，数据流的中位数就是各自堆顶元素的平均值
            return (self.min_heap[0] + self.max_heap[0][1]) / 2

        


# Your MedianFinder object will be instantiated and called as such:
# obj = MedianFinder()
# obj.addNum(num)
# param_2 = obj.findMedian()
```

##### 1.8 [距离相等的条形码](https://leetcode-cn.com/problems/distant-barcodes/)

id：1054

在一个仓库里，有一排条形码，其中第 `i` 个条形码为 `barcodes[i]`。

请你重新排列这些条形码，使其中两个相邻的条形码 **不能** 相等。 你可以返回任何满足该要求的答案，此题保证存在答案。

 

**示例 1：**

```
输入：[1,1,1,2,2,2]
输出：[2,1,2,1,2,1]
```

**示例 2：**

```
输入：[1,1,1,1,2,2,3,3]
输出：[1,3,1,3,2,1,2,1]
```

贪心堆

```java
package com.strings.leetcode.heap;


import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.PriorityQueue;

class Problem_1054j_rearrangeBarcodes {
    public static int[] rearrangeBarcodes2(int[] barcodes) {
        if(barcodes == null || barcodes.length < 2){
            return barcodes;
        }
        Map<Integer,Integer> countMap = new HashMap<>();
        for(int b:barcodes){
            countMap.put(b,countMap.getOrDefault(b,0)+1);
        }
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>((a, b) -> countMap.get(b) - countMap.get(a));

        for(int i:countMap.keySet()){
            maxHeap.add(i);
        }
        int[] res = new int[barcodes.length];
        int idx = 0;
        while(maxHeap.size() > 1){
            int a = maxHeap.poll();
            int b = maxHeap.poll();
            res[idx++] = a;
            res[idx++] = b;
            int freqA = countMap.get(a);
            int freqB = countMap.get(b);
            if(freqA > 1){
                countMap.put(a,freqA-1);
                maxHeap.offer(a);
            }
            if(freqB > 1){
                countMap.put(b,freqB-1);
                maxHeap.add(b);
            }
        }
        if(maxHeap.size() > 0){
            res[idx] = maxHeap.poll();
        }

        return res;
    }

    public static int[] rearrangeBarcodes(int[] barcodes) {
        if(barcodes == null || barcodes.length < 2) return barcodes;
        Map<Integer, Integer> map = new HashMap<>();
        for(int i : barcodes) {
            map.put(i, map.getOrDefault(i, 0) + 1);
        }
        //大顶堆
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>((a, b) -> map.get(b) - map.get(a));
        for(int i : map.keySet()) {
            maxHeap.offer(i);
        }
        int[] res = new int[barcodes.length];
        int idx = 0;
        while(maxHeap.size() > 1) {
            int a = maxHeap.poll();
            int b = maxHeap.poll();
            res[idx++] = a;
            res[idx++] = b;
            int freqA = map.get(a);
            int freqB = map.get(b);
            if(freqA > 1) {
                map.put(a, freqA - 1);
                maxHeap.add(a);
            }
            if(freqB > 1) {
                map.put(b, freqB - 1);
                maxHeap.add(b);
            }
        }
        //收尾
        if(maxHeap.size() > 0) res[idx] = maxHeap.poll();
        return res;
    }

    public static void main(String[] args) {
        int[] bor = {1,1,2};
        System.out.println(Arrays.toString(rearrangeBarcodes(bor)));
        System.out.println(Arrays.toString(rearrangeBarcodes2(bor)));
    }
}

```

##### 1.9 [ 重构字符串](https://leetcode-cn.com/problems/reorganize-string/)

给定一个字符串S，检查是否能重新排布其中的字母，使得两相邻的字符不同。

若可行，输出任意可行的结果。若不可行，返回空字符串。

示例 1:

输入: S = "aab"
输出: "aba"
示例 2:

输入: S = "aaab"
输出: ""



```java
package com.strings.leetcode.heap;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.PriorityQueue;

public class Problem_767_reorganizeString {

    public static String reorganizeString(String S) {
        if(S == null || S.length() < 2){
            return S;
        }
        char[] barcodes = S.toCharArray();
            Map<Character,Integer> countMap = new HashMap<>();
            for(char b:barcodes){
                countMap.put(b,countMap.getOrDefault(b,0)+1);
            }
            if(Collections.max(countMap.values()) > (S.length()+1)/2){
                return "";
            }
            PriorityQueue<Character> maxHeap = new PriorityQueue<>((a, b) -> countMap.get(b) - countMap.get(a));

            for(char i:countMap.keySet()){
                maxHeap.add(i);
            }
            char[] res = new char[barcodes.length];
            int idx = 0;
            while(maxHeap.size() > 1){
                char a = maxHeap.poll();
                char b = maxHeap.poll();
                res[idx++] = a;
                res[idx++] = b;
                int freqA = countMap.get(a);
                int freqB = countMap.get(b);
                if(freqA > 1){
                    countMap.put(a,freqA-1);
                    maxHeap.offer(a);
                }
                if(freqB > 1){
                    countMap.put(b,freqB-1);
                    maxHeap.add(b);
                }
            }
            if(maxHeap.size() > 0){
                res[idx] = maxHeap.poll();
            }
            return String.valueOf(res);
    }

    public static void main(String[] args) {
        String S1 = "aab";
        String S2 = "aaab";

        System.out.println(reorganizeString(S1));
        System.out.println(reorganizeString(S2));
    }
}

```

##### 1.10 [有序矩阵中第K小的元素](https://leetcode-cn.com/problems/kth-smallest-element-in-a-sorted-matrix/)

id:378

给定一个 n x n 矩阵，其中每行和每列元素均按升序排序，找到矩阵中第k小的元素。
请注意，它是排序后的第 k 小元素，而不是第 k 个不同的元素。

 

示例:

matrix = [
   [ 1,  5,  9],
   [10, 11, 13],
   [12, 13, 15]
],
k = 8,

返回 13。

```java
package com.strings.leetcode.heap;

import java.util.Comparator;
import java.util.PriorityQueue;

public class Problem_378_kthSmallest {
    public static int kthSmallest(int[][] matrix, int k) {
        PriorityQueue<Integer> heap = new PriorityQueue<>(Comparator.reverseOrder());
        for(int[] arr:matrix){
            for(int i: arr){
                heap.offer(i);
                if(heap.size() > k){
                    heap.poll();
                }
            }
        }
        return heap.peek();
    }

    public static void main(String[] args) {
        int[][] matrix = {{1,  5,  9},{10, 11, 13},{12, 13, 15}};
        System.out.println(kthSmallest(matrix,8));
    }

}
```

##### 1.11 [根据字符出现频率排序](https://leetcode-cn.com/problems/sort-characters-by-frequency/)

id:451

给定一个字符串，请将字符串里的字符按照出现的频率降序排列。

示例 1:

输入:
"tree"

输出:
"eert"

解释:
'e'出现两次，'r'和't'都只出现一次。
因此'e'必须出现在'r'和't'之前。此外，"eetr"也是一个有效的答案。

```java
package com.strings.leetcode.heap;

import java.util.*;

public class Problem_451j_frequencySort {

    public static String frequencySort(String s){
        if(s == null || s.length() < 2){
            return s;
        }
        char[] barcodes = s.toCharArray();
        Map<Character,Integer> countMap = new HashMap<>();
        for(char b:barcodes){
            countMap.put(b,countMap.getOrDefault(b,0)+1);
        }

        PriorityQueue<Character> maxHeap = new PriorityQueue<>((a, b) -> countMap.get(b) - countMap.get(a));

        for(char i:countMap.keySet()){
            maxHeap.add(i);
        }

        StringBuilder sb = new StringBuilder();
        while (!maxHeap.isEmpty()){  // 注意不能使用for(char c:maxHeap)
            char a = maxHeap.poll();
            int freq = countMap.get(a);
            for (int i = 0; i < freq; i++) {
                sb.append(a);
            }
        }

        return sb.toString();
    }

    public static void main(String[] args) {
        String s  = "Aabb";
        System.out.println(frequencySort(s));
    }
}

```

