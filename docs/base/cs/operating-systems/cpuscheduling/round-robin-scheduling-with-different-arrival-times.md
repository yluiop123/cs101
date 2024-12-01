# 轮询调度（Round Robin Scheduling）与不同的到达时间

**先决条件：** 到达时间为0的轮询调度

轮询调度算法用于公平地为每个作业分配一个时间槽或量子，并在作业未在量子时间内完成时中断该作业，这样使得这些作业能够公平地被调度。

**注意：**

- 轮询是循环的，因此不会发生饥饿现象。
- 轮询是先来先服务调度的一个变种。
- 不会给予任何进程或任务优先级，没有特殊的重视。
- 轮询调度也被称为时间片调度。

**优点：**

- 每个进程都被CPU服务一个固定时间，因此每个进程的优先级相同。
- 由于其循环性，不会出现饥饿现象。

**缺点：**

- 吞吐量取决于量子时间。
- 如果量子时间太长，轮询会退化为先来先服务（FCFS）。
- 如果我们想要给予某些进程优先权，我们无法做到。

| 进程 | 到达时间 | 执行时间 | 完成时间 | 周转时间 | 等待时间 |
| --- | --- | --- | --- | --- | --- |
| P1 | 0 | 5 | 12 | 12 | 7 |
| P2 | 1 | 4 | 11 | 10 | 6 |
| P3 | 2 | 2 | 6 | 4 | 2 |
| P4 | 3 | 1 | 9 | 6 | 5 |

**量子时间是2** 这意味着每个进程一次只能执行2个单位时间。

**如何计算这些进程请求：**

1. 取出最先发生的进程并开始执行该进程（仅限量子时间）。
2. 检查是否有其他进程请求到达。如果在一个进程执行量子时间期间有进程请求到达，那么将新进程添加到就绪队列中。
3. 量子时间过后，检查就绪队列中是否有进程。如果就绪队列为空，则继续当前进程。如果队列不为空且当前进程未完成，则将当前进程添加到就绪队列的末尾。
4. 从就绪队列中取出第一个进程并开始执行它（同样的规则）。
5. 重复上述步骤2-4。
6. 如果进程完成并且就绪队列为空，则任务完成。

在所有这些之后，我们得到了三个时间：

1. **完成时间：** 进程完成所需的时间。
2. **周转时间：** 进程在系统中存在的总时间。（完成时间 – 到达时间）。
3. **等待时间：** 等待其完全执行的总时间。（周转时间 – 执行时间）。

**如何在编程语言中实现**

```
1. 声明 arrival[], burst[], wait[], turn[] 数组并初始化它们。同时声明一个计时器变量并将其初始化为零。为了保持原始的 burst 数组，创建另一个数组（temp_burst[]）并将 burst 数组中的所有值复制到其中。

2. 为了进行检查，我们创建另一个布尔类型的数组，它记录一个进程是否已完成。我们还需要维护一个队列数组，其中包含进程索引（最初该数组用0填充）。

3. 现在我们将计时器变量递增，直到第一个进程到达，当它到达时，我们将进程索引添加到队列数组

4. 现在我们执行第一个进程直到时间量子，并且在那个时间量子期间，我们检查是否有其他进程已经到达，如果是，我们将索引添加到队列中（通过调用函数 queueUpdation()）。

5. 现在，在执行了上述步骤后，如果一个进程已经完成，我们存储它的退出时间并执行队列数组中的下一个进程。否则，我们将当前执行的进程移动到队列的末尾（通过调用另一个函数 queueMaintainence()），当时间片到期时。

6. 然后重复上述步骤，直到所有进程都已完全执行。如果出现一些进程尚未到达的情况，我们将等待，CPU在此期间将保持空闲。
```

以下是上述方法的实现：

（为了简单起见，我们假设到达时间是按排序方式输入的）


::: code-group
```cpp [C++]
//C++ Program for implementing
//Round Robin Algorithm
//code by sparsh_cbs
#include <iostream>

using namespace std;

void queueUpdation(int queue[],int timer,int arrival[],int n, int maxProccessIndex){
	int zeroIndex;
	for(int i = 0; i < n; i++){
		if(queue[i] == 0){
			zeroIndex = i;
			break;
		}
	} 
	queue[zeroIndex] = maxProccessIndex + 1;
}

void queueMaintainence(int queue[], int n){
	for(int i = 0; (i < n-1) && (queue[i+1] != 0) ; i++){
		int temp = queue[i];
		queue[i] = queue[i+1];
		queue[i+1] = temp; 
	}
}

void checkNewArrival(int timer, int arrival[], int n, int maxProccessIndex,int queue[]){
	if(timer <= arrival[n-1]){
	bool newArrival = false;
	for(int j = (maxProccessIndex+1); j < n; j++){
			if(arrival[j] <= timer){
			if(maxProccessIndex < j){
				maxProccessIndex = j;
				newArrival = true;
			}
		}
	}
	//adds the incoming process to the ready queue
	//(if any arrives)
	if(newArrival)
		queueUpdation(queue,timer,arrival,n, maxProccessIndex);
	}
}

//Driver Code
int main(){
	int n,tq, timer = 0, maxProccessIndex = 0;
	float avgWait = 0, avgTT = 0;
	cout << "\nEnter the time quanta : ";
	cin>>tq;
	cout << "\nEnter the number of processes : ";
	cin>>n;
	int arrival[n], burst[n], wait[n], turn[n], queue[n], temp_burst[n];
	bool complete[n];

	cout << "\nEnter the arrival time of the processes : ";
	for(int i = 0; i < n; i++)
		cin>>arrival[i];

	cout << "\nEnter the burst time of the processes : ";
	for(int i = 0; i < n; i++){
		cin>>burst[i];
		temp_burst[i] = burst[i];
	}

	for(int i = 0; i < n; i++){ //Initializing the queue and complete array
		complete[i] = false;
		queue[i] = 0;
	}
	while(timer < arrival[0]) //Incrementing Timer until the first process arrives
		timer++; 
	queue[0] = 1;
	
	while(true){
		bool flag = true;
		for(int i = 0; i < n; i++){
			if(temp_burst[i] != 0){
				flag = false;
				break;
			}
		}
		if(flag)
			break;

		for(int i = 0; (i < n) && (queue[i] != 0); i++){
			int ctr = 0;
			while((ctr < tq) && (temp_burst[queue[0]-1] > 0)){
				temp_burst[queue[0]-1] -= 1;
				timer += 1;
				ctr++;

				//Checking and Updating the ready queue until all the processes arrive
				checkNewArrival(timer, arrival, n, maxProccessIndex, queue);
			}
			//If a process is completed then store its exit time
			//and mark it as completed
			if((temp_burst[queue[0]-1] == 0) && (complete[queue[0]-1] == false)){
				//turn array currently stores the completion time
				turn[queue[0]-1] = timer;	 
				complete[queue[0]-1] = true;
			}
			
			//checks whether or not CPU is idle
			bool idle = true;
			if(queue[n-1] == 0){
				for(int i = 0; i < n && queue[i] != 0; i++){
					if(complete[queue[i]-1] == false){
						idle = false;
					}
				}
			}
			else
				idle = false;

			if(idle){
				timer++;
				checkNewArrival(timer, arrival, n, maxProccessIndex, queue);
			}
	
			//Maintaining the entries of processes 
			//after each premption in the ready Queue
			queueMaintainence(queue,n);
		}
	}

	for(int i = 0; i < n; i++){
		turn[i] = turn[i] - arrival[i];
		wait[i] = turn[i] - burst[i];
	}

	cout << "\nProgram No.\tArrival Time\tBurst Time\tWait Time\tTurnAround Time"
		<< endl;
	for(int i = 0; i < n; i++){
		cout<<i+1<<"\t\t"<<arrival[i]<<"\t\t"
		<<burst[i]<<"\t\t"<<wait[i]<<"\t\t"<<turn[i]<<endl;
	}
	for(int i =0; i< n; i++){
		avgWait += wait[i];
		avgTT += turn[i]; 
	}
	cout<<"\nAverage wait time : "<<(avgWait/n)
	<<"\nAverage Turn Around Time : "<<(avgTT/n);

	return 0;
	
}

```
```java [Java]
//JAVA Program for implementing
//Round Robin Algorithm
// code by Sparsh_cbs
import java.util.*;

public class RoundRobin{
	private static Scanner inp = new Scanner(System.in);
	//Driver Code
	public static void main(String[] args){
		int n,tq, timer = 0, maxProccessIndex = 0;
		float avgWait = 0, avgTT = 0;
		System.out.print("\nEnter the time quanta : ");
		tq = inp.nextInt();
		System.out.print("\nEnter the number of processes : ");
		n = inp.nextInt();
		int arrival[] = new int[n];
		int burst[] = new int[n];
		int wait[] = new int[n];
		int turn[] = new int[n];
		int queue[] = new int[n];
		int temp_burst[] = new int[n];
		boolean complete[] = new boolean[n];

		System.out.print("\nEnter the arrival time of the processes : ");
		for(int i = 0; i < n; i++)
			arrival[i] = inp.nextInt();

		System.out.print("\nEnter the burst time of the processes : ");
		for(int i = 0; i < n; i++){
			burst[i] = inp.nextInt();
			temp_burst[i] = burst[i];
		}

		for(int i = 0; i < n; i++){ //Initializing the queue and complete array
			complete[i] = false;
			queue[i] = 0;
		}
		while(timer < arrival[0]) //Incrementing Timer until the first process arrives
			timer++; 
		queue[0] = 1;
		
		while(true){
			boolean flag = true;
			for(int i = 0; i < n; i++){
				if(temp_burst[i] != 0){
					flag = false;
					break;
				}
			}
			if(flag)
				break;

			for(int i = 0; (i < n) && (queue[i] != 0); i++){
				int ctr = 0;
				while((ctr < tq) && (temp_burst[queue[0]-1] > 0)){
					temp_burst[queue[0]-1] -= 1;
					timer += 1;
					ctr++;

					//Updating the ready queue until all the processes arrive
					checkNewArrival(timer, arrival, n, maxProccessIndex, queue);
				}
				if((temp_burst[queue[0]-1] == 0) && (complete[queue[0]-1] == false)){
					turn[queue[0]-1] = timer;	 //turn currently stores exit times
					complete[queue[0]-1] = true;
				}
				
				//checks whether or not CPU is idle
				boolean idle = true;
				if(queue[n-1] == 0){
					for(int k = 0; k < n && queue[k] != 0; k++){
						if(complete[queue[k]-1] == false){
							idle = false;
						}
					}
				}
				else
					idle = false;

				if(idle){
					timer++;
					checkNewArrival(timer, arrival, n, maxProccessIndex, queue);
				}
			
				//Maintaining the entries of processes after each premption in the ready Queue
				queueMaintainence(queue,n);
			}
		}

		for(int i = 0; i < n; i++){
			turn[i] = turn[i] - arrival[i];
			wait[i] = turn[i] - burst[i];
		}

		System.out.print("\nProgram No.\tArrival Time\tBurst Time\tWait Time\tTurnAround Time"
						+ "\n");
		for(int i = 0; i < n; i++){
			System.out.print(i+1+"\t\t"+arrival[i]+"\t\t"+burst[i]
							+"\t\t"+wait[i]+"\t\t"+turn[i]+ "\n");
		}
		for(int i =0; i< n; i++){
			avgWait += wait[i];
			avgTT += turn[i]; 
		}
		System.out.print("\nAverage wait time : "+(avgWait/n)
						+"\nAverage Turn Around Time : "+(avgTT/n));
	}
	public static void queueUpdation(int queue[],int timer,int arrival[],int n, int maxProccessIndex){
		int zeroIndex = -1;
		for(int i = 0; i < n; i++){
			if(queue[i] == 0){
				zeroIndex = i;
				break;
			}
		}
		if(zeroIndex == -1)
			return;
		queue[zeroIndex] = maxProccessIndex + 1;
	}

	public static void checkNewArrival(int timer, int arrival[], int n, int maxProccessIndex,int queue[]){
		if(timer <= arrival[n-1]){
			boolean newArrival = false;
			for(int j = (maxProccessIndex+1); j < n; j++){
				if(arrival[j] <= timer){
					if(maxProccessIndex < j){
						maxProccessIndex = j;
						newArrival = true;
					}
				}
			}
			if(newArrival) //adds the index of the arriving process(if any)
				queueUpdation(queue,timer,arrival,n, maxProccessIndex);	 
		}
	}

	public static void queueMaintainence(int queue[], int n){

		for(int i = 0; (i < n-1) && (queue[i+1] != 0) ; i++){
			int temp = queue[i];
			queue[i] = queue[i+1];
			queue[i+1] = temp; 
		}
	}
}

```

```python [Python3]
# Python program for implementing Round Robin Algorithm
def queueUpdation(queue, timer, arrival, n, maxProccessIndex):
	zeroIndex = -1
	for i in range(n):
		if(queue[i] == 0):
			zeroIndex = i
			break

	if(zeroIndex == -1):
		return
	queue[zeroIndex] = maxProccessIndex + 1


def checkNewArrival(timer, arrival, n, maxProccessIndex, queue):
	if(timer <= arrival[n-1]):
		newArrival = False
		for j in range(maxProccessIndex+1, n):
			if(arrival[j] <= timer):
				if(maxProccessIndex < j):
					maxProccessIndex = j
					newArrival = True

		# adds the index of the arriving process(if any)
		if(newArrival):
			queueUpdation(queue, timer, arrival, n, maxProccessIndex)


def queueMaintainence(queue, n):
	for i in range(n-1):
		if(queue[i+1] != 0):
			queue[i], queue[i+1] = queue[i+1], queue[i]


timer, maxProccessIndex = 0, 0
avgWait, avgTT = 0, 0
print("\nEnter the time quanta :", end=" ")
tq = int(input())
print("\nEnter the number of processes :", end=" ")
n = int(input())
arrival = [0]*n
burst = [0]*n
wait = [0]*n
turn = [0]*n
queue = [0]*n
temp_burst = [0]*n
complete = [False]*n
print("\nEnter the arrival time of the processes :", end=" ")
for i in range(n):
	arrival[i] = int(input())

print("\nEnter the burst time of the processes :", end=" ")
for i in range(n):
	burst[i] = int(input())
	temp_burst[i] = burst[i]

for i in range(n):
		# Initializing the queue and complete array
	complete[i] = False
	queue[i] = 0

while(timer < arrival[0]):
		# Incrementing Timer until the first process arrives
	timer += 1
queue[0] = 1

while(True):
	flag = True
	for i in range(n):
		if(temp_burst[i] != 0):
			flag = False
			break

	if(flag):
		break

	for i in range(n and queue[i] != 0):
		ctr = 0
		while((ctr < tq) and (temp_burst[queue[0]-1] > 0)):
			temp_burst[queue[0]-1] -= 1
			timer += 1
			ctr += 1

			# Updating the ready queue until all the processes arrive
			checkNewArrival(timer, arrival, n, maxProccessIndex, queue)

		if((temp_burst[queue[0]-1] == 0) and (complete[queue[0]-1] == False)):
			# turn currently stores exit times
			turn[queue[0]-1] = timer
			complete[queue[0]-1] = True

		# checks whether or not CPU is idle
		idle = True
		if(queue[n-1] == 0):
			for k in range(n):
				if(queue[k] != 0):
					if(complete[queue[k]-1] == False):
						idle = False
		else:
			idle = False

		if(idle):
			timer += 1
			checkNewArrival(timer, arrival, n, maxProccessIndex, queue)

		# Maintaining the entries of processes aftereach premption in the ready Queue
		queueMaintainence(queue, n)

for i in range(n):
	turn[i] = turn[i] - arrival[i]
	wait[i] = turn[i] - burst[i]

print("\nProgram No.\tArrival Time\tBurst Time\tWait Time\tTurnAround Time\n")

for i in range(n):
	print(i+1, "\t\t", arrival[i], "\t\t", burst[i],
		"\t\t", wait[i], "\t\t", turn[i], "\n")

for i in range(n):
	avgWait += wait[i]
	avgTT += turn[i]

print("\nAverage wait time : ", (avgWait//n))
print("\nAverage Turn Around Time : ", (avgTT//n))

# This code is contributed by lokeshmvs21.

```
```csharp [C#]
// C# program to implement Round Robin
// Scheduling with different arrival time
using System;

class GFG {
	public static void roundRobin(String[] p, int[] a,
								int[] b, int n)
	{
		// result of average times
		int res = 0;
		int resc = 0;

		// for sequence storage
		String seq = "";

		// copy the burst array and arrival array
		// for not effecting the actual array
		int[] res_b = new int[b.Length];
		int[] res_a = new int[a.Length];

		for (int i = 0; i < res_b.Length; i++) {
			res_b[i] = b[i];
			res_a[i] = a[i];
		}

		// critical time of system
		int t = 0;

		// for store the waiting time
		int[] w = new int[p.Length];

		// for store the Completion time
		int[] comp = new int[p.Length];

		while (true) {
			Boolean flag = true;
			for (int i = 0; i < p.Length; i++) {

				// these condition for if
				// arrival is not on zero

				// check that if there come before qtime
				if (res_a[i] <= t) {
					if (res_a[i] <= n) {
						if (res_b[i] > 0) {
							flag = false;
							if (res_b[i] > n) {

								// make decrease the b time
								t = t + n;
								res_b[i] = res_b[i] - n;
								res_a[i] = res_a[i] + n;
								seq += "->" + p[i];
							}
							else {

								// for last time
								t = t + res_b[i];

								// store comp time
								comp[i] = t - a[i];

								// store wait time
								w[i] = t - b[i] - a[i];
								res_b[i] = 0;

								// add sequence
								seq += "->" + p[i];
							}
						}
					}
					else if (res_a[i] > n) {

						// is any have less arrival time
						// the coming process then execute
						// them
						for (int j = 0; j < p.Length; j++) {

							// compare
							if (res_a[j] < res_a[i]) {
								if (res_b[j] > 0) {
									flag = false;
									if (res_b[j] > n) {
										t = t + n;
										res_b[j]
											= res_b[j] - n;
										res_a[j]
											= res_a[j] + n;
										seq += "->" + p[j];
									}
									else {
										t = t + res_b[j];
										comp[j] = t - a[j];
										w[j] = t - b[j]
											- a[j];
										res_b[j] = 0;
										seq += "->" + p[j];
									}
								}
							}
						}

						// now the previous process
						// according to ith is process
						if (res_b[i] > 0) {
							flag = false;

							// Check for greaters
							if (res_b[i] > n) {
								t = t + n;
								res_b[i] = res_b[i] - n;
								res_a[i] = res_a[i] + n;
								seq += "->" + p[i];
							}
							else {
								t = t + res_b[i];
								comp[i] = t - a[i];
								w[i] = t - b[i] - a[i];
								res_b[i] = 0;
								seq += "->" + p[i];
							}
						}
					}
				}

				// if no process is come on the critical
				else if (res_a[i] > t) {
					t++;
					i--;
				}
			}

			// for exit the while loop
			if (flag) {
				break;
			}
		}

		Console.WriteLine("name ctime wtime");
		for (int i = 0; i < p.Length; i++) {
			Console.WriteLine(" " + p[i] + "\t" + comp[i]
							+ "\t" + w[i]);

			res = res + w[i];
			resc = resc + comp[i];
		}

		Console.WriteLine("Average waiting time is "
						+ (float)res / p.Length);
		Console.WriteLine("Average compilation time is "
						+ (float)resc / p.Length);
		Console.WriteLine("Sequence is like that " + seq);
	}

	// Driver Code
	public static void Main(String[] args)
	{
		// name of the process
		String[] name = { "p1", "p2", "p3", "p4" };

		// arrival for every process
		int[] arrivaltime = { 0, 1, 2, 3 };

		// burst time for every process
		int[] bursttime = { 10, 4, 5, 3 };

		// quantum time of each process
		int q = 3;

		// cal the function for output
		roundRobin(name, arrivaltime, bursttime, q);
	}
}

// This code is contributed by Rajput-Ji

```



```javascript [Javascript]
<script>

const queueUpdation = (queue, timer, arrival, n, maxProccessIndex) => {
			let zeroIndex;
			for (let i = 0; i < n; i++) {
				if (queue[i] == 0) {
					zeroIndex = i;
					break;
				}
			}
			queue[zeroIndex] = maxProccessIndex + 1;
		}

		const queueMaintainence = (queue, n) => {
			for (let i = 0; (i < n - 1) && (queue[i + 1] != 0); i++) {
				let temp = queue[i];
				queue[i] = queue[i + 1];
				queue[i + 1] = temp;
			}
		}

		const checkNewArrival = (timer, arrival, n, maxProccessIndex, queue) => {
			if (timer <= arrival[n - 1]) {
				let newArrival = false;
				for (let j = (maxProccessIndex + 1); j < n; j++) {
					if (arrival[j] <= timer) {
						if (maxProccessIndex < j) {
							maxProccessIndex = j;
							newArrival = true;
						}
					}
				}
				//adds the incoming process to the ready queue
				//(if any arrives)
				if (newArrival)
					queueUpdation(queue, timer, arrival, n, maxProccessIndex);
			}
		}

		//Driver Code
		let n = 4;
		let tq = 2;
		let timer = 0;
		let maxProccessIndex = 0;
		let avgWait = 0;
		let avgTT = 0;
		const wait = [];
		const turn = [];
		const queue = [];
		const temp_burst = [];
		const complete = [];
		const arrival = [0, 1, 2, 3];
		const burst = [5, 4, 2, 1];

		for (let i = 0; i < n; i++) {
			temp_burst[i] = burst[i];
		}

		for (let i = 0; i < n; i++) { //Initializing the queue and complete array
			complete[i] = false;
			queue[i] = 0;
		}
		while (timer < arrival[0]) //Incrementing Timer until the first process arrives
			timer++;
		queue[0] = 1;

		while (true) {
		let flag = true;
			for (let i = 0; i < n; i++) {
				if (temp_burst[i] != 0) {
					flag = false;
					break;
				}
			}
			if (flag)
				break;

			for (let i = 0; (i < n) && (queue[i] != 0); i++) {
				let ctr = 0;
				while ((ctr < tq) && (temp_burst[queue[0] - 1] > 0)) {
					temp_burst[queue[0] - 1] -= 1;
					timer += 1;
					ctr++;

					// Checking and Updating the ready queue until all the processes arrive
					checkNewArrival(timer, arrival, n, maxProccessIndex, queue);
				}
				// If a process is completed then store its exit time
				// and mark it as completed
				if ((temp_burst[queue[0] - 1] == 0) && (complete[queue[0] - 1] == false)) {
					//turn array currently stores the completion time
					turn[queue[0] - 1] = timer;
					complete[queue[0] - 1] = true;
				}

				// checks whether or not CPU is idle
				let idle = true;
				if (queue[n - 1] == 0) {
					for (let i = 0; i < n && queue[i] != 0; i++) {
						if (complete[queue[i] - 1] == false) {
							idle = false;
						}
					}
				}
				else
					idle = false;

				if (idle) {
					timer++;
					checkNewArrival(timer, arrival, n, maxProccessIndex, queue);
				}

				//Maintaining the entries of processes 
				//after each premption in the ready Queue
				queueMaintainence(queue, n);
			}
		}

		for (let i = 0; i < n; i++) {
			turn[i] = turn[i] - arrival[i];
			wait[i] = turn[i] - burst[i];
		}

		console.log(`Time Quanta : ${tq}`);
		console.log(`Number of Processes : ${n}`);
		console.log(`Arrival Time of Processes : ${arrival}`);
		console.log(`Burst Time of Processes : ${burst}`);

		console.log("\nProgram No.\tArrival Time\tBurst Time\tWait Time\tTurnAround Time\n");
		for (let i = 0; i < n; i++) {
			console.log(`${i + 1}\t\t\t ${arrival[i]}\t\t\t ${burst[i]}\t\t\t\t ${wait[i]} \t\t\t\t ${turn[i]} \n`);
		}
		for (let i = 0; i < n; i++) {
			avgWait += wait[i];
			avgTT += turn[i];
		}
		console.log(`\nAverage wait time : ${avgWait / n}`);
		console.log(`\nAverage Turn Around Time : ${avgTT / n}`);

// This code is contributed by akashish_.

</script>

```
:::

**输出：**

```
Enter the time quanta : 2Enter the number of processes : 4Enter the arrival time of the processes : 0 1 2 3Enter the burst time of the processes : 5 4 2 1
Program No
.     Arrival Time    Burst Time      Wait Time       TurnAround Time
1               0               5               7               12
2               1               4               6               10
3               2               2               2               4
4               3               1               5               6Average wait time : 5
Average Turn Around Time : 8
```

如果有关于代码的任何疑问或问题，请在评论区写下。

**注意：** 通过使用队列数据结构，可以稍微优化上述代码的实现，如下所示：

::: code-group
```cpp [C++]
#include <bits/stdc++.h>

using namespace std;

struct Process
{
	int pid;
	int arrivalTime;
	int burstTime;
	int burstTimeRemaining; // the amount of CPU time remaining after each execution
	int completionTime;
	int turnaroundTime;
	int waitingTime;
	bool isComplete;
	bool inQueue;
};

/*
* At every time quantum or when a process has been executed before the time quantum,
* check for any new arrivals and push them into the queue
*/
void checkForNewArrivals(Process processes[], const int n, const int currentTime, queue<int> &readyQueue)
{
	for (int i = 0; i < n; i++)
	{
		Process p = processes[i];
		// checking if any processes has arrived
		// if so, push them in the ready Queue.
		if (p.arrivalTime <= currentTime && !p.inQueue && !p.isComplete)
		{
			processes[i].inQueue = true;
			readyQueue.push(i);
		}
	}
}

/*
* Context switching takes place at every time quantum
* At every iteration, the burst time of the processes in the queue are handled using this method
*/
void updateQueue(Process processes[], const int n, const int quantum, queue<int> &readyQueue, int ¤tTime, int &programsExecuted)
{
	int i = readyQueue.front();
	readyQueue.pop();

	// if the process is going to be finished executing, 
	// ie, when it's remaining burst time is less than time quantum
	// mark it completed and increment the current time
	// and calculate its waiting time and turnaround time
	if (processes[i].burstTimeRemaining <= quantum)
	{
		processes[i].isComplete = true;
		currentTime += processes[i].burstTimeRemaining;
		processes[i].completionTime = currentTime;
		processes[i].waitingTime = processes[i].completionTime - processes[i].arrivalTime - processes[i].burstTime;
		processes[i].turnaroundTime = processes[i].waitingTime + processes[i].burstTime;

		if (processes[i].waitingTime < 0)
			processes[i].waitingTime = 0;

		processes[i].burstTimeRemaining = 0;

		// if all the processes are not yet inserted in the queue,
		// then check for new arrivals
		if (programsExecuted != n)
		{
			checkForNewArrivals(processes, n, currentTime, readyQueue);
		}
	}
	else
	{
		// the process is not done yet. But it's going to be pre-empted 
		// since one quantum is used
		// but first subtract the time the process used so far
		processes[i].burstTimeRemaining -= quantum;
		currentTime += quantum;

		// if all the processes are not yet inserted in the queue,
		// then check for new arrivals
		if (programsExecuted != n)
		{
			checkForNewArrivals(processes, n, currentTime, readyQueue);
		}
		// insert the incomplete process back into the queue
		readyQueue.push(i);
	}
}

/*
* Just a function that outputs the result in terms of their PID.
*/
void output(Process processes[], const int n)
{
	double avgWaitingTime = 0;
	double avgTurntaroundTime = 0;
	// sort the processes array by processes.PID
	sort(processes, processes + n, [](const Process &p1, const Process &p2)
		{ return p1.pid < p2.pid; });

	for (int i = 0; i < n; i++)
	{
		cout << "Process " << processes[i].pid << ": Waiting Time: " << processes[i].waitingTime << " Turnaround Time: " << processes[i].turnaroundTime << endl;
		avgWaitingTime += processes[i].waitingTime;
		avgTurntaroundTime += processes[i].turnaroundTime;
	}
	cout << "Average Waiting Time: " << avgWaitingTime / n << endl;
	cout << "Average Turnaround Time: " << avgTurntaroundTime / n << endl;
}

/* 
* This function assumes that the processes are already sorted according to their arrival time
*/
void roundRobin(Process processes[], int n, int quantum)
{
	queue<int> readyQueue;
	readyQueue.push(0); // initially, pushing the first process which arrived first
	processes[0].inQueue = true;

	int currentTime = 0; // holds the current time after each process has been executed
	int programsExecuted = 0; // holds the number of programs executed so far

	while (!readyQueue.empty())
	{
		updateQueue(processes, n, quantum, readyQueue, currentTime, programsExecuted);
	}
}

int main()
{
	int n, quantum;

	cout << "Enter the number of processes: ";
	cin >> n;
	cout << "Enter time quantum: ";
	cin >> quantum;

	Process processes[n + 1];

	for (int i = 0; i < n; i++)
	{
		cout << "Enter arrival time and burst time of each process " << i + 1 << ": ";
		cin >> processes[i].arrivalTime;
		cin >> processes[i].burstTime;
		processes[i].burstTimeRemaining = processes[i].burstTime;
		processes[i].pid = i + 1;
		cout << endl;
	}

	// stl sort in terms of arrival time
	sort(processes, processes + n, [](const Process &p1, const Process &p2)
		{ return p1.arrivalTime < p2.arrivalTime; });

	roundRobin(processes, n, quantum);

	output(processes, n);

	return 0;
}
```
```java [Java]
// Java Code
import java.util.Arrays;
import java.util.LinkedList;
import java.util.Queue;

class GFG {

// At every time quantum or when a process has been
// executed before the time quantum, check for any new
// arrivals and push them into the queue
public static void
	checkForNewArrivals(Process[] processes, int n,
						int currentTime,
						Queue<Integer> readyQueue)
{
	for (int i = 0; i < n; i++) {
	Process p = processes[i];
	// checking if any processes has arrived
	// if so, push them in the ready Queue.
	if (p.arrivalTime <= currentTime && !p.inQueue
		&& !p.isComplete) {
		processes[i].inQueue = true;
		readyQueue.add(i);
	}
	}
}

// Context switching takes place at every time quantum
// At every iteration, the burst time of the processes
// in the queue are handled using this method
public static void
	updateQueue(Process[] processes, int n, int quantum,
				Queue<Integer> readyQueue, int currentTime,
				int programsExecuted)
{
	int i = readyQueue.remove();

	// if the process is going to be finished executing,
	// ie, when it's remaining burst time is less than
	// time quantum mark it completed and increment the
	// current time and calculate its waiting time and
	// turnaround time
	if (processes[i].burstTimeRemaining <= quantum) {
	processes[i].isComplete = true;
	currentTime += processes[i].burstTimeRemaining;
	processes[i].completionTime = currentTime;
	processes[i].waitingTime
		= processes[i].completionTime
		- processes[i].arrivalTime
		- processes[i].burstTime;
	processes[i].turnaroundTime
		= processes[i].waitingTime
		+ processes[i].burstTime;

	if (processes[i].waitingTime < 0)
		processes[i].waitingTime = 0;

	processes[i].burstTimeRemaining = 0;

	// if all the processes are not yet inserted in
	// the queue, then check for new arrivals
	if (programsExecuted != n) {
		checkForNewArrivals(
		processes, n, currentTime, readyQueue);
	}
	}
	else {
	// the process is not done yet. But it's going
	// to be pre-empted since one quantum is used
	// but first subtract the time the process used
	// so far
	processes[i].burstTimeRemaining -= quantum;
	currentTime += quantum;

	// if all the processes are not yet inserted in
	// the queue, then check for new arrivals
	if (programsExecuted != n) {
		checkForNewArrivals(
		processes, n, currentTime, readyQueue);
	}
	// insert the incomplete process back into the
	// queue
	readyQueue.add(i);
	}
}

// Just a function that outputs the result in terms of
// their PID.
public static void output(Process[] processes, int n)
{
	double avgWaitingTime = 0;
	double avgTurntaroundTime = 0;
	// sort the processes array by processes.PID
	Arrays.sort(processes, (Process p1, Process p2) -> {
	return p1.pid - p2.pid;
	});

	for (int i = 0; i < n; i++) {
	System.out.println(
		"Process " + processes[i].pid
		+ ": Waiting Time: "
		+ processes[i].waitingTime
		+ " Turnaround Time: "
		+ processes[i].turnaroundTime);
	avgWaitingTime += processes[i].waitingTime;
	avgTurntaroundTime
		+= processes[i].turnaroundTime;
	}
	System.out.println("Average Waiting Time: "
					+ avgWaitingTime / n);
	System.out.println("Average Turnaround Time: "
					+ avgTurntaroundTime / n);
}

/*
	* This function assumes that the processes are already
	* sorted according to their arrival time
	*/
public static void roundRobin(Process[] processes,
								int n, int quantum)
{
	Queue<Integer> readyQueue
	= new LinkedList<Integer>();
	readyQueue.add(0); // initially, pushing the first
	// process which arrived first
	processes[0].inQueue = true;

	int currentTime
	= 0; // holds the current time after each
	// process has been executed
	int programsExecuted
	= 0; // holds the number of programs executed so
	// far

	while (!readyQueue.isEmpty()) {
	updateQueue(processes, n, quantum, readyQueue,
				currentTime, programsExecuted);
	}
}

public static class Process {
	int pid;
	int arrivalTime;
	int burstTime;
	int burstTimeRemaining; // the amount of CPU time
	// remaining after each
	// execution
	int completionTime;
	int turnaroundTime;
	int waitingTime;
	boolean isComplete;
	boolean inQueue;
}

public static void main(String[] args)
{
	int n, quantum;

	System.out.println(
	"Enter the number of processes: ");
	n = Integer.parseInt(System.console().readLine());
	System.out.println("Enter time quantum: ");
	quantum
	= Integer.parseInt(System.console().readLine());

	Process[] processes = new Process[n + 1];

	for (int i = 0; i < n; i++) {
	System.out.println(
		"Enter arrival time and burst time of each process "
		+ (i + 1) + ": ");
	processes[i].arrivalTime = Integer.parseInt(
		System.console().readLine());
	processes[i].burstTime = Integer.parseInt(
		System.console().readLine());
	processes[i].burstTimeRemaining
		= processes[i].burstTime;
	processes[i].pid = i + 1;
	System.out.println();
	}

	// stl sort in terms of arrival time
	Arrays.sort(processes, (Process p1, Process p2) -> {
	return p1.arrivalTime - p2.arrivalTime;
	});

	roundRobin(processes, n, quantum);

	output(processes, n);
}
}

// This code is contributed by akashish__

```

```python [Python3]
# Python Code
class Process:
	def __init__(self):
		self.pid = 0
		self.arrivalTime = 0
		self.burstTime = 0
		self.burstTimeRemaining = 0
		self.completionTime = 0
		self.turnaroundTime = 0
		self.waitingTime = 0
		self.isComplete = False
		self.inQueue = False

# At every time quantum or when a process has been executed before the time quantum,
# check for any new arrivals and push them into the queue
def check_for_new_arrivals(processes, n, current_time, ready_queue):
	for i in range(n):
		p = processes[i]
		# checking if any processes has arrived
		# if so, push them in the ready Queue.
		if p.arrivalTime <= current_time and not p.inQueue and not p.isComplete:
			processes[i].inQueue = True
			ready_queue.append(i)

# Context switching takes place at every time quantum
# At every iteration, the burst time of the processes in the queue are handled using this method
def update_queue(processes, n, quantum, ready_queue, current_time, programs_executed):
	i = ready_queue[0]
	ready_queue.pop(0)

	# if the process is going to be finished executing,
	# ie, when it's remaining burst time is less than time quantum
	# mark it completed and increment the current time
	# and calculate its waiting time and turnaround time
	if processes[i].burstTimeRemaining <= quantum:
		processes[i].isComplete = True
		current_time += processes[i].burstTimeRemaining
		processes[i].completionTime = current_time
		processes[i].waitingTime = processes[i].completionTime - processes[i].arrivalTime - processes[i].burstTime
		processes[i].turnaroundTime = processes[i].waitingTime + processes[i].burstTime

		if processes[i].waitingTime < 0:
			processes[i].waitingTime = 0

		processes[i].burstTimeRemaining = 0

		# if all the processes are not yet inserted in the queue,
		# then check for new arrivals
		if programs_executed != n:
			check_for_new_arrivals(processes, n, current_time, ready_queue)
	else:
		# the process is not done yet. But it's going to be pre-empted
		# since one quantum is used
		# but first subtract the time the process used so far
		processes[i].burstTimeRemaining -= quantum
		current_time += quantum

		# if all the processes are not yet inserted in the queue,
		# then check for new arrivals
		if programs_executed != n:
			check_for_new_arrivals(processes, n, current_time, ready_queue)
		# insert the incomplete process back into the queue
		ready_queue.append(i)

# Just a function that outputs the result in terms of their PID.
def output(processes, n):
	avg_waiting_time = 0
	avg_turntaround_time = 0
	# sort the processes array by processes.PID
	processes.sort(key=lambda p: p.pid)

	for i in range(n):
		print("Process ", processes[i].pid, ": Waiting Time: ", processes[i].waitingTime,
			" Turnaround Time: ", processes[i].turnaroundTime, sep="")
		avg_waiting_time += processes[i].waitingTime
		avg_turntaround_time += processes[i].turnaroundTime
	print("Average Waiting Time: ", avg_waiting_time / n)
	print("Average Turnaround Time: ", avg_turntaround_time / n)

# This function assumes that the processes are already sorted according to their arrival time
def round_robin(processes, n, quantum):
	ready_queue = []
	ready_queue.append(0) # initially, pushing the first process which arrived first
	processes[0].inQueue = True

	current_time = 0 # holds the current time after each process has been executed
	programs_executed = 0 # holds the number of programs executed so far

	while len(ready_queue) != 0:
		update_queue(processes, n, quantum, ready_queue, current_time, programs_executed)

def main():
	n = int(input("Enter the number of processes: "))
	quantum = int(input("Enter time quantum: "))

	processes = []

	for i in range(n):
		print("Enter arrival time and burst time of each process ", i + 1, ": ", sep="", end="")
		arrival_time = int(input())
		burst_time = int(input())
		proc = Process()
		proc.arrivalTime = arrival_time
		proc.burstTime = burst_time
		proc.burstTimeRemaining = burst_time
		proc.pid = i + 1
		processes.append(proc)
		print("")

	# stl sort in terms of arrival time
	processes.sort(key=lambda p: p.arrivalTime)

	round_robin(processes, n, quantum)

	output(processes, n)

main()

# This code is contributed by akashish__

```

```csharp [C#]
// C# Code
using System;
using System.Collections.Generic;
using System.Linq;

class GFG 
{ 
	// At every time quantum or when a process has been 
	// executed before the time quantum, check for any new 
	// arrivals and push them into the queue 
	public static void
		checkForNewArrivals(Process[] processes, int n, 
							int currentTime, 
							Queue<int> readyQueue) 
	{ 
		for (int i = 0; i < n; i++) 
		{ 
			Process p = processes[i]; 
			// checking if any processes has arrived 
			// if so, push them in the ready Queue. 
			if (p.arrivalTime <= currentTime && !p.inQueue 
				&& !p.isComplete) 
			{ 
				processes[i].inQueue = true; 
				readyQueue.Enqueue(i); 
			} 
		} 
	} 

	// Context switching takes place at every time quantum 
	// At every iteration, the burst time of the processes 
	// in the queue are handled using this method 
	public static void
		updateQueue(Process[] processes, int n, int quantum, 
					Queue<int> readyQueue, int currentTime, 
					int programsExecuted) 
	{ 
		int i = readyQueue.Dequeue(); 

		// if the process is going to be finished executing, 
		// ie, when it's remaining burst time is less than 
		// time quantum mark it completed and increment the 
		// current time and calculate its waiting time and 
		// turnaround time 
		if (processes[i].burstTimeRemaining <= quantum) 
		{ 
			processes[i].isComplete = true; 
			currentTime += processes[i].burstTimeRemaining; 
			processes[i].completionTime = currentTime; 
			processes[i].waitingTime 
				= processes[i].completionTime 
				- processes[i].arrivalTime 
				- processes[i].burstTime; 
			processes[i].turnaroundTime 
				= processes[i].waitingTime 
				+ processes[i].burstTime; 

			if (processes[i].waitingTime < 0) 
				processes[i].waitingTime = 0; 

			processes[i].burstTimeRemaining = 0; 

			// if all the processes are not yet inserted in 
			// the queue, then check for new arrivals 
			if (programsExecuted != n) 
			{ 
				checkForNewArrivals( 
					processes, n, currentTime, readyQueue); 
			} 
		} 
		else
		{ 
			// the process is not done yet. But it's going 
			// to be pre-empted since one quantum is used 
			// but first subtract the time the process used 
			// so far 
			processes[i].burstTimeRemaining -= quantum; 
			currentTime += quantum; 

			// if all the processes are not yet inserted in 
			// the queue, then check for new arrivals 
			if (programsExecuted != n) 
			{ 
				checkForNewArrivals( 
					processes, n, currentTime, readyQueue); 
			} 
			// insert the incomplete process back into the 
			// queue 
			readyQueue.Enqueue(i); 
		} 
	} 

	// Just a function that outputs the result in terms of 
	// their PID. 
	public static void output(Process[] processes, int n) 
	{ 
		double avgWaitingTime = 0; 
		double avgTurntaroundTime = 0; 
		// sort the processes array by processes.PID 
		processes = processes.OrderBy(p => p.pid).ToArray();

		for (int i = 0; i < n; i++) 
		{ 
			Console.WriteLine("Process " + processes[i].pid 
							+ ": Waiting Time: "
							+ processes[i].waitingTime 
							+ " Turnaround Time: "
							+ processes[i].turnaroundTime); 
			avgWaitingTime += processes[i].waitingTime; 
			avgTurntaroundTime 
				+= processes[i].turnaroundTime; 
		} 
		Console.WriteLine("Average Waiting Time: "
						+ avgWaitingTime / n); 
		Console.WriteLine("Average Turnaround Time: "
						+ avgTurntaroundTime / n); 
	} 

	/*
	* This function assumes that the processes are already
	* sorted according to their arrival time
	*/
	public static void roundRobin(Process[] processes, 
								int n, int quantum) 
	{ 
		Queue<int> readyQueue 
			= new Queue<int>(); 
		readyQueue.Enqueue(0); // initially, pushing the first 
		// process which arrived first 
		processes[0].inQueue = true; 

		int currentTime 
			= 0; // holds the current time after each 
		// process has been executed 
		int programsExecuted 
			= 0; // holds the number of programs executed so 
		// far 

		while (readyQueue.Count() > 0) 
		{ 
			updateQueue(processes, n, quantum, readyQueue, 
						currentTime, programsExecuted); 
		} 
	} 

	public class Process 
	{ 
		public int pid; 
		public int arrivalTime; 
		public int burstTime; 
		public int burstTimeRemaining; // the amount of CPU time 
		// remaining after each 
		// execution 
		public int completionTime; 
		public int turnaroundTime; 
		public int waitingTime; 
		public bool isComplete; 
		public bool inQueue; 
	} 

	public static void Main(String[] args) 
	{ 
		int n, quantum; 

		Console.WriteLine("Enter the number of processes: "); 
		n = int.Parse(Console.ReadLine()); 
		Console.WriteLine("Enter time quantum: "); 
		quantum 
			= int.Parse(Console.ReadLine()); 

		Process[] processes = new Process[n + 1]; 

		for (int i = 0; i < n; i++) 
		{ 
			Console.WriteLine("Enter arrival time and burst time of each process "
							+ (i + 1) + ": "); 
			processes[i].arrivalTime = int.Parse( 
				Console.ReadLine()); 
			processes[i].burstTime = int.Parse( 
				Console.ReadLine()); 
			processes[i].burstTimeRemaining 
				= processes[i].burstTime; 
			processes[i].pid = i + 1; 
			Console.WriteLine(); 
		} 

		// stl sort in terms of
	processes.OrderBy(p => p.arrivalTime).ToArray();
	roundRobin(processes, n, quantum);

	output(processes, n);
}
}

// This code is contributed by akashish__

```

```javascript [Javascript]
const readline = require('readline-sync');

class Process {
	constructor(pid, arrivalTime, burstTime) {
		this.pid = pid;
		this.arrivalTime = arrivalTime;
		this.burstTime = burstTime;
		this.burstTimeRemaining = burstTime;
		this.completionTime = 0;
		this.turnaroundTime = 0;
		this.waitingTime = 0;
		this.isComplete = false;
		this.inQueue = false;
	}
}

function checkForNewArrivals(processes, currentTime, readyQueue) {
	processes.forEach((p, i) => {
		if (p.arrivalTime <= currentTime && !p.inQueue && !p.isComplete) {
			processes[i].inQueue = true;
			readyQueue.push(i);
		}
	});
}

function updateQueue(processes, quantum, readyQueue, currentTime, programsExecuted) {
	const i = readyQueue.shift();

	if (processes[i].burstTimeRemaining <= quantum) {
		processes[i].isComplete = true;
		currentTime += processes[i].burstTimeRemaining;
		processes[i].completionTime = currentTime;
		processes[i].waitingTime = 
		processes[i].completionTime - processes[i].arrivalTime - processes[i].burstTime;
		processes[i].turnaroundTime = 
		processes[i].waitingTime + processes[i].burstTime;

		if (processes[i].waitingTime < 0)
			processes[i].waitingTime = 0;

		processes[i].burstTimeRemaining = 0;

		if (programsExecuted !== processes.length - 1) {
			checkForNewArrivals(processes, currentTime, readyQueue);
		}
	} else {
		processes[i].burstTimeRemaining -= quantum;
		currentTime += quantum;

		if (programsExecuted !== processes.length - 1) {
			checkForNewArrivals(processes, currentTime, readyQueue);
		}
		readyQueue.push(i);
	}
}

function output(processes) {
	let avgWaitingTime = 0;
	let avgTurnaroundTime = 0;

	processes.sort((p1, p2) => p1.pid - p2.pid);

	processes.forEach(p => {
		console.log(`Process ${p.pid}: Waiting Time: ${p.waitingTime} Turnaround Time: ${p.turnaroundTime}`);
		avgWaitingTime += p.waitingTime;
		avgTurnaroundTime += p.turnaroundTime;
	});

	console.log(`Average Waiting Time: ${avgWaitingTime / processes.length}`);
	console.log(`Average Turnaround Time: ${avgTurnaroundTime / processes.length}`);
}

function roundRobin(processes, quantum) {
	const readyQueue = [0];
	processes[0].inQueue = true;

	let currentTime = 0;
	let programsExecuted = 0;

	while (readyQueue.length > 0) {
		updateQueue(processes, quantum, readyQueue, currentTime, programsExecuted);
	}
}

function main() {
	const n = parseInt(readline.question("Enter the number of processes: "));
	const quantum = parseInt(readline.question("Enter time quantum: "));

	const processes = Array.from({ length: n }, (_, i) => {
		console.log(`Enter arrival time and burst time of each process ${i + 1}: `);
		const arrivalTime = parseInt(readline.question("Arrival Time: "));
		const burstTime = parseInt(readline.question("Burst Time: "));
		return new Process(i + 1, arrivalTime, burstTime);
	});

	processes.sort((p1, p2) => p1.arrivalTime - p2.arrivalTime);

	roundRobin(processes, quantum);

	output(processes);
}

main();

```
:::

**输出：**

```
Enter the number of processes: 4
Enter time quantum: 2
Enter arrival time and burst time of each process 1:
Arrival Time: 0
Burst Time: 5
Enter arrival time and burst time of each process 2:
Arrival Time: 1
Burst Time: 4
Enter arrival time and burst time of each process 3:
Arrival Time: 2
Burst Time: 2
Enter arrival time and burst time of each process 4:
Arrival Time: 3
Burst Time: 1
Process 1: Waiting Time: 7 Turnaround Time: 12
Process 2: Waiting Time: 6 Turnaround Time: 10
Process 3: Waiting Time: 2 Turnaround Time: 4
Process 4: Waiting Time: 5 Turnaround Time: 6
Average Waiting Time: 5
Average Turnaround Time: 8
```

