# SynchronousQueue

`SynchronousQueue` 类实现了 `BlockingQueue` 接口。
有关该接口的更多信息，请阅读 `BlockingQueue` 文本。

`SynchronousQueue` 是一个队列，可用于与另一个线程交换单个元素。
插入元素到队列的线程会被阻塞，直到另一个线程从队列中取出该元素。
同样，如果一个线程尝试取出一个元素，而当前没有元素存在，那么该线程将被阻塞，
直到一个线程向队列中插入一个元素。

将这个类称为队列有点言过其实。它更像是一个会合点。

