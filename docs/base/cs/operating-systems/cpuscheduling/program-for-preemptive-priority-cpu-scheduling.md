# 抢占式优先级CPU调度程序

实现优先级CPU调度。在这个问题中，我们使用最小堆作为实现优先级调度的数据结构。

**在这个问题中，较小的数字表示更高的优先级。**

下面给出的代码中使用了以下函数：

```
struct process {
   processID,
   burst time,
   response time,
   priority,
   arrival time.
}
```

- **void quicksort(process array[], int low, int high):** 这个函数用于根据它们的到达时间将进程按升序排列。
- **int partition(process array[], int low, int high):** 这个函数用于对数组进行分区以进行排序。
- **void insert(process Heap[], process value, int *heapsize, int *currentTime):** 它用于将所有有效和符合条件的进程包含在堆中以执行。heapsize定义了根据当前时间currentTime记录的执行中的进程数量。
- **void order(process Heap[], int *heapsize, int start):** 如果在插入新进程后，它用于根据优先级重新排序堆中的进程。
- **void extractminimum(process Heap[], int *heapsize, int *currentTime):** 这个函数用于从堆中找到最高优先级的进程。它还在提取最高优先级进程后重新排序堆。
- **void scheduling(process Heap[], process array[], int n, int *heapsize, int *currentTime):** 这个函数负责执行从Heap[]中提取的最高优先级进程。
- **void process(process array[], int n):** 这个函数负责管理进程的整体执行，因为它们根据到达时间到达CPU。

**实现：**
::: code-group
```cpp [C++]
// CPP program to implement preemptive priority scheduling
#include <bits/stdc++.h>
using namespace std;

struct Process {
	int processID;
	int burstTime;
	int tempburstTime;
	int responsetime;
	int arrivalTime;
	int priority;
	int outtime;
	int intime;
};

// It is used to include all the valid and eligible
// processes in the heap for execution. heapsize defines
// the number of processes in execution depending on
// the current time currentTime keeps a record of
// the current CPU time.
void insert(Process Heap[], Process value, int* heapsize,
			int* currentTime)
{
	int start = *heapsize, i;
	Heap[*heapsize] = value;
	if (Heap[*heapsize].intime == -1)
		Heap[*heapsize].intime = *currentTime;
	++(*heapsize);

	// Ordering the Heap
	while (start != 0
		&& Heap[(start - 1) / 2].priority
				> Heap[start].priority) {
		Process temp = Heap[(start - 1) / 2];
		Heap[(start - 1) / 2] = Heap[start];
		Heap[start] = temp;
		start = (start - 1) / 2;
	}
}

// It is used to reorder the heap according to
// priority if the processes after insertion
// of new process.
void order(Process Heap[], int* heapsize, int start)
{
	int smallest = start;
	int left = 2 * start + 1;
	int right = 2 * start + 2;
	if (left < *heapsize
		&& Heap[left].priority
			< Heap[smallest].priority)
		smallest = left;
	if (right < *heapsize
		&& Heap[right].priority
			< Heap[smallest].priority)
		smallest = right;

	// Ordering the Heap
	if (smallest != start) {
		Process temp = Heap[smallest];
		Heap[smallest] = Heap[start];
		Heap[start] = temp;
		order(Heap, heapsize, smallest);
	}
}

// This function is used to find the process with
// highest priority from the heap. It also reorders
// the heap after extracting the highest priority process.
Process extractminimum(Process Heap[], int* heapsize,
					int* currentTime)
{
	Process min = Heap[0];
	if (min.responsetime == -1)
		min.responsetime
			= *currentTime - min.arrivalTime;
	--(*heapsize);
	if (*heapsize >= 1) {
		Heap[0] = Heap[*heapsize];
		order(Heap, heapsize, 0);
	}
	return min;
}

// Compares two intervals
// according to starting times.
bool compare(Process p1, Process p2)
{
	return (p1.arrivalTime < p2.arrivalTime);
}

// This function is responsible for executing
// the highest priority extracted from Heap[].
void scheduling(Process Heap[], Process array[], int n,
				int* heapsize, int* currentTime)
{
	if (heapsize == 0)
		return;

	Process min = extractminimum(
		Heap, heapsize, currentTime);
	min.outtime = *currentTime + 1;
	--min.burstTime;
	printf("process id = %d current time = %d\n",
		min.processID, *currentTime);

	// If the process is not yet finished
	// insert it back into the Heap*/
	if (min.burstTime > 0) {
		insert(Heap, min, heapsize, currentTime);
		return;
	}

	for (int i = 0; i < n; i++)
		if (array[i].processID == min.processID) {
			array[i] = min;
			break;
		}
}

// This function is responsible for
// managing the entire execution of the
// processes as they arrive in the CPU
// according to their arrival time.
void priority(Process array[], int n)
{
	sort(array, array + n, compare);

	int totalwaitingtime = 0, totalbursttime = 0,
		totalturnaroundtime = 0, i, insertedprocess = 0,
		heapsize = 0, currentTime = array[0].arrivalTime,
		totalresponsetime = 0;

	Process Heap[4 * n];

	// Calculating the total burst time
	// of the processes
	for (int i = 0; i < n; i++) {
		totalbursttime += array[i].burstTime;
		array[i].tempburstTime = array[i].burstTime;
	}

	// Inserting the processes in Heap
	// according to arrival time
	do {
		if (insertedprocess != n) {
			for (i = 0; i < n; i++) {
				if (array[i].arrivalTime == currentTime) {
					++insertedprocess;
					array[i].intime = -1;
					array[i].responsetime = -1;
					insert(Heap, array[i],
						&heapsize, ¤tTime);
				}
			}
		}
		scheduling(Heap, array, n,
				&heapsize, ¤tTime);
		++currentTime;
		if (heapsize == 0
			&& insertedprocess == n)
			break;
	} while (1);

	for (int i = 0; i < n; i++) {
		totalresponsetime
			+= array[i].responsetime;
		totalwaitingtime
			+= (array[i].outtime
				- array[i].intime
				- array[i].tempburstTime);
		totalbursttime += array[i].burstTime;
	}
	printf("Average waiting time = %f\n",
		((float)totalwaitingtime / (float)n));
	printf("Average response time =%f\n",
		((float)totalresponsetime / (float)n));
	printf("Average turn around time = %f\n",
		((float)(totalwaitingtime
					+ totalbursttime)
			/ (float)n));
}

// Driver code
int main()
{
	int n, i;
	Process a[5];
	a[0].processID = 1;
	a[0].arrivalTime = 4;
	a[0].priority = 2;
	a[0].burstTime = 6;
	a[1].processID = 4;
	a[1].arrivalTime = 5;
	a[1].priority = 1;
	a[1].burstTime = 3;
	a[2].processID = 2;
	a[2].arrivalTime = 5;
	a[2].priority = 3;
	a[2].burstTime = 1;
	a[3].processID = 3;
	a[3].arrivalTime = 1;
	a[3].priority = 4;
	a[3].burstTime = 2;
	a[4].processID = 5;
	a[4].arrivalTime = 3;
	a[4].priority = 5;
	a[4].burstTime = 4;
	priority(a, 5);
	return 0;
}
```
```java [Java]
import java.util.Arrays;
import java.util.Comparator;

class Process {
	int processID;
	int arrivalTime;
	int priority;
	int burstTime;
	int tempBurstTime;
	int responseTime;
	int outTime;
	int inTime;

	Process(int processID, int arrivalTime, int priority, int burstTime) {
		this.processID = processID;
		this.arrivalTime = arrivalTime;
		this.priority = priority;
		this.burstTime = burstTime;
		this.tempBurstTime = burstTime;
		this.responseTime = -1;
		this.outTime = 0;
		this.inTime = -1;
	}
}

public class PriorityScheduling {
	// Function to insert a process into the heap
	static void insert(Process[] heap, Process value, int[] heapSize, int[] currentTime) {
		int start = heapSize[0];
		heap[heapSize[0]] = value;
		if (heap[heapSize[0]].inTime == -1) {
			heap[heapSize[0]].inTime = currentTime[0];
		}
		heapSize[0]++;

		// Ordering the Heap
		while (start != 0 && heap[(start - 1) / 2].priority > heap[start].priority) {
			Process temp = heap[(start - 1) / 2];
			heap[(start - 1) / 2] = heap[start];
			heap[start] = temp;
			start = (start - 1) / 2;
		}
	}

	// Function to reorder the heap based on priority
	static void order(Process[] heap, int heapSize, int start) {
		int smallest = start;
		int left = 2 * start + 1;
		int right = 2 * start + 2;
		if (left < heapSize && heap[left].priority < heap[smallest].priority) {
			smallest = left;
		}
		if (right < heapSize && heap[right].priority < heap[smallest].priority) {
			smallest = right;
		}

		// Ordering the Heap
		if (smallest != start) {
			Process temp = heap[smallest];
			heap[smallest] = heap[start];
			heap[start] = temp;
			order(heap, heapSize, smallest);
		}
	}

	// Function to extract the process with the highest priority from the heap
	static Process extractMinimum(Process[] heap, int[] heapSize, int[] currentTime) {
		Process minProcess = heap[0];
		if (minProcess.responseTime == -1) {
			minProcess.responseTime = currentTime[0] - minProcess.arrivalTime;
		}
		heapSize[0]--;
		if (heapSize[0] >= 1) {
			heap[0] = heap[heapSize[0]];
			order(heap, heapSize[0], 0);
		}
		return minProcess;
	}

	// Function to compare two processes based on arrival time
	static boolean compare(Process p1, Process p2) {
		return p1.arrivalTime < p2.arrivalTime;
	}

	// Function responsible for executing the highest priority process extracted from the heap
	static void scheduling(Process[] heap, Process[] array, int n, int[] heapSize, int[] currentTime) {
		if (heapSize[0] == 0) {
			return;
		}

		Process minProcess = extractMinimum(heap, heapSize, currentTime);
		minProcess.outTime = currentTime[0] + 1;
		minProcess.burstTime--;

		System.out.println("process id = " + minProcess.processID + " current time = " + currentTime[0]);

		// If the process is not yet finished, insert it back into the Heap
		if (minProcess.burstTime > 0) {
			insert(heap, minProcess, heapSize, currentTime);
			return;
		}

		for (int i = 0; i < n; i++) {
			if (array[i].processID == minProcess.processID) {
				array[i] = minProcess;
				break;
			}
		}
	}

	// Function responsible for managing the entire execution of processes based on arrival time
	static void priority(Process[] array, int n) {
		Arrays.sort(array, Comparator.comparingInt(o -> o.arrivalTime));

		int totalWaitingTime = 0;
		int totalBurstTime = 0;
		int totalTurnaroundTime = 0;
		int insertedProcess = 0;
		int[] heapSize = {0};
		int[] currentTime = {array[0].arrivalTime};
		int totalResponseTime = 0;

		Process[] heap = new Process[4 * n];

		// Calculating the total burst time of the processes
		for (int i = 0; i < n; i++) {
			totalBurstTime += array[i].burstTime;
			array[i].tempBurstTime = array[i].burstTime;
		}

		// Inserting the processes into Heap according to arrival time
		do {
			if (insertedProcess != n) {
				for (int i = 0; i < n; i++) {
					if (array[i].arrivalTime == currentTime[0]) {
						insertedProcess++;
						array[i].inTime = -1;
						array[i].responseTime = -1;
						insert(heap, array[i], heapSize, currentTime);
					}
				}
			}
			scheduling(heap, array, n, heapSize, currentTime);
			currentTime[0]++;
			if (heapSize[0] == 0 && insertedProcess == n) {
				break;
			}
		} while (true);

		for (int i = 0; i < n; i++) {
			totalResponseTime += array[i].responseTime;
			totalWaitingTime += (array[i].outTime - array[i].inTime - array[i].tempBurstTime);
			totalTurnaroundTime += (array[i].outTime - array[i].inTime);
			totalBurstTime += array[i].burstTime;
		}

		System.out.println("Average waiting time = " + ((float) totalWaitingTime / n));
		System.out.println("Average response time = " + ((float) totalResponseTime / n));
		System.out.println("Average turn around time = " + ((float) (totalWaitingTime + totalBurstTime) / n));
	}

	// Driver code
	public static void main(String[] args) {
		int n = 5;
		Process[] a = {
				new Process(1, 4, 2, 6),
				new Process(4, 5, 1, 3),
				new Process(2, 5, 3, 1),
				new Process(3, 1, 4, 2),
				new Process(5, 3, 5, 4)
		};

		priority(a, n);
	}
}

```
```python [Python3]
class Process:
	def __init__(self, processID, arrivalTime, priority, burstTime):
		self.processID = processID
		self.arrivalTime = arrivalTime
		self.priority = priority
		self.burstTime = burstTime
		self.tempburstTime = burstTime
		self.responsetime = -1
		self.outtime = 0
		self.intime = -1


def insert(Heap, value, heapsize, currentTime):
	start = heapsize[0]
	Heap[heapsize[0]] = value
	if Heap[heapsize[0]].intime == -1:
		Heap[heapsize[0]].intime = currentTime[0]
	heapsize[0] += 1

	# Ordering the Heap
	while start != 0 and Heap[(start - 1) // 2].priority > Heap[start].priority:
		Heap[(start - 1) // 2], Heap[start] = Heap[start], Heap[(start - 1) // 2]
		start = (start - 1) // 2


def order(Heap, heapsize, start):
	smallest = start
	left = 2 * start + 1
	right = 2 * start + 2
	if left < heapsize[0] and Heap[left].priority < Heap[smallest].priority:
		smallest = left
	if right < heapsize[0] and Heap[right].priority < Heap[smallest].priority:
		smallest = right

	# Ordering the Heap
	if smallest != start:
		Heap[start], Heap[smallest] = Heap[smallest], Heap[start]
		order(Heap, heapsize, smallest)


def extract_minimum(Heap, heapsize, currentTime):
	min_process = Heap[0]
	if min_process.responsetime == -1:
		min_process.responsetime = currentTime[0] - min_process.arrivalTime
	heapsize[0] -= 1
	if heapsize[0] >= 1:
		Heap[0] = Heap[heapsize[0]]
		order(Heap, heapsize, 0)
	return min_process


def compare(p1, p2):
	return p1.arrivalTime < p2.arrivalTime


def scheduling(Heap, array, n, heapsize, currentTime):
	if heapsize[0] == 0:
		return

	min_process = extract_minimum(Heap, heapsize, currentTime)
	min_process.outtime = currentTime[0] + 1
	min_process.burstTime -= 1
	print(f"process id = {min_process.processID} current time = {currentTime[0]}")

	# If the process is not yet finished, insert it back into the Heap
	if min_process.burstTime > 0:
		insert(Heap, min_process, heapsize, currentTime)
		return

	for i in range(n):
		if array[i].processID == min_process.processID:
			array[i] = min_process
			break


def priority(array, n):
	array.sort(key=lambda x: x.arrivalTime)

	total_waiting_time = 0
	total_burst_time = 0
	total_turnaround_time = 0
	inserted_process = 0
	heap_size = [0]
	current_time = [array[0].arrivalTime]
	total_response_time = 0

	Heap = [None] * (4 * n)

	# Calculating the total burst time of the processes
	for i in range(n):
		total_burst_time += array[i].burstTime
		array[i].tempburstTime = array[i].burstTime

	# Inserting the processes in Heap according to arrival time
	while True:
		if inserted_process != n:
			for i in range(n):
				if array[i].arrivalTime == current_time[0]:
					inserted_process += 1
					array[i].intime = -1
					array[i].responsetime = -1
					insert(Heap, array[i], heap_size, current_time)
		scheduling(Heap, array, n, heap_size, current_time)
		current_time[0] += 1
		if heap_size[0] == 0 and inserted_process == n:
			break

	for i in range(n):
		total_response_time += array[i].responsetime
		total_waiting_time += (array[i].outtime - array[i].intime - array[i].tempburstTime)
		total_turnaround_time += (array[i].outtime - array[i].intime)
		total_burst_time += array[i].burstTime

	print(f"Average waiting time = {total_waiting_time / n}")
	print(f"Average response time = {total_response_time / n}")
	print(f"Average turn around time = {total_turnaround_time / n}")


# Driver code
if __name__ == "__main__":
	n = 5
	a = [
		Process(1, 4, 2, 6),
		Process(4, 5, 1, 3),
		Process(2, 5, 3, 1),
		Process(3, 1, 4, 2),
		Process(5, 3, 5, 4)
	]
	priority(a, n)

```
```csharp [C#]
using System;
using System.Collections.Generic;
using System.Linq;

class Process
{
	public int ProcessID { get; set; }
	public int ArrivalTime { get; set; }
	public int Priority { get; set; }
	public int BurstTime { get; set; }
	public int TempBurstTime { get; set; }
	public int ResponseTime { get; set; } = -1;
	public int OutTime { get; set; }
	public int InTime { get; set; } = -1;

	// Constructor to initialize a Process object
	public Process(int processID, int arrivalTime, int priority, int burstTime)
	{
		ProcessID = processID;
		ArrivalTime = arrivalTime;
		Priority = priority;
		BurstTime = burstTime;
		TempBurstTime = burstTime;
	}
}

class Program
{
	// Function to insert a process into the heap
	static void Insert(List<Process> heap, Process value, ref int heapSize, ref int currentTime)
	{
		int start = heapSize;
		heap.Add(value);
		if (heap[heapSize].InTime == -1)
			heap[heapSize].InTime = currentTime;
		heapSize++;

		// Ordering the Heap
		while (start != 0 && heap[(start - 1) / 2].Priority > heap[start].Priority)
		{
			Process temp = heap[(start - 1) / 2];
			heap[(start - 1) / 2] = heap[start];
			heap[start] = temp;
			start = (start - 1) / 2;
		}
	}

	// Function to reorder the heap based on priority
	static void Order(List<Process> heap, int heapSize, int start)
	{
		int smallest = start;
		int left = 2 * start + 1;
		int right = 2 * start + 2;
		if (left < heapSize && heap[left].Priority < heap[smallest].Priority)
			smallest = left;
		if (right < heapSize && heap[right].Priority < heap[smallest].Priority)
			smallest = right;

		// Ordering the Heap
		if (smallest != start)
		{
			Process temp = heap[smallest];
			heap[smallest] = heap[start];
			heap[start] = temp;
			Order(heap, heapSize, smallest);
		}
	}

	// Function to extract the process with the highest priority from the heap
	static Process ExtractMinimum(List<Process> heap, ref int heapSize, ref int currentTime)
	{
		Process minProcess = heap[0];
		if (minProcess.ResponseTime == -1)
			minProcess.ResponseTime = currentTime - minProcess.ArrivalTime;
		heapSize--;
		if (heapSize >= 1)
		{
			heap[0] = heap[heapSize];
			Order(heap, heapSize, 0);
		}
		return minProcess;
	}

	// Function to compare two processes based on arrival time
	static bool Compare(Process p1, Process p2)
	{
		return p1.ArrivalTime < p2.ArrivalTime;
	}

	// Function responsible for executing the highest priority process extracted from the heap
	static void Scheduling(List<Process> heap, List<Process> array, int n, ref int heapSize, ref int currentTime)
	{
		if (heapSize == 0)
			return;

		Process minProcess = ExtractMinimum(heap, ref heapSize, ref currentTime);
		minProcess.OutTime = currentTime + 1;
		minProcess.BurstTime--;

		Console.WriteLine($"process id = {minProcess.ProcessID} current time = {currentTime}");

		// If the process is not yet finished, insert it back into the Heap
		if (minProcess.BurstTime > 0)
		{
			Insert(heap, minProcess, ref heapSize, ref currentTime);
			return;
		}

		for (int i = 0; i < n; i++)
		{
			if (array[i].ProcessID == minProcess.ProcessID)
			{
				array[i] = minProcess;
				break;
			}
		}
	}

	// Function responsible for managing the entire execution of processes based on arrival time
	static void Priority(List<Process> array, int n)
	{
		array = array.OrderBy(p => p.ArrivalTime).ToList();

		int totalWaitingTime = 0;
		int totalBurstTime = 0;
		int totalTurnaroundTime = 0;
		int insertedProcess = 0;
		int heapSize = 0;
		int currentTime = array[0].ArrivalTime;
		int totalResponseTime = 0;

		List<Process> heap = new List<Process>(4 * n);

		// Calculating the total burst time of the processes
		for (int i = 0; i < n; i++)
		{
			totalBurstTime += array[i].BurstTime;
			array[i].TempBurstTime = array[i].BurstTime;
		}

		// Inserting the processes in Heap according to arrival time
		do
		{
			if (insertedProcess != n)
			{
				for (int i = 0; i < n; i++)
				{
					if (array[i].ArrivalTime == currentTime)
					{
						insertedProcess++;
						array[i].InTime = -1;
						array[i].ResponseTime = -1;
						Insert(heap, array[i], ref heapSize, ref currentTime);
					}
				}
			}
			Scheduling(heap, array, n, ref heapSize, ref currentTime);
			currentTime++;
			if (heapSize == 0 && insertedProcess == n)
				break;
		} while (true);

		for (int i = 0; i < n; i++)
		{
			totalResponseTime += array[i].ResponseTime;
			totalWaitingTime += (array[i].OutTime - array[i].InTime - array[i].TempBurstTime);
			totalTurnaroundTime += (array[i].OutTime - array[i].InTime);
			totalBurstTime += array[i].BurstTime;
		}

		Console.WriteLine($"Average waiting time = {totalWaitingTime / (float)n}");
		Console.WriteLine($"Average response time = {totalResponseTime / (float)n}");
		Console.WriteLine($"Average turn around time = {totalTurnaroundTime / (float)n}");
	}

	static void Main(string[] args)
	{
		int n = 5;
		List<Process> a = new List<Process>
		{
			new Process(1, 4, 2, 6),
			new Process(4, 5, 1, 3),
			new Process(2, 5, 3, 1),
			new Process(3, 1, 4, 2),
			new Process(5, 3, 5, 4)
		};

		Priority(a, n);
	}
}

```
```js [Javascript]
class Process {
	constructor(processID, arrivalTime, priority, burstTime) {
		this.ProcessID = processID;
		this.ArrivalTime = arrivalTime;
		this.Priority = priority;
		this.BurstTime = burstTime;
		this.TempBurstTime = burstTime;
		this.ResponseTime = -1;
		this.OutTime = 0;
		this.InTime = -1;
	}
}

// Function to insert a process into the heap
function Insert(heap, value, heapSize, currentTime) {
	let start = heapSize[0];
	heap[start] = value;
	if (heap[start].InTime === -1) {
		heap[start].InTime = currentTime[0];
	}
	heapSize[0]++;

	// Ordering the Heap
	while (start !== 0 && heap[Math.floor((start - 1) / 2)].Priority > heap[start].Priority) {
		[heap[Math.floor((start - 1) / 2)], heap[start]] = [heap[start], heap[Math.floor((start - 1) / 2)]];
		start = Math.floor((start - 1) / 2);
	}
}

// Function to reorder the heap based on priority
function Order(heap, heapSize, start) {
	let smallest = start;
	let left = 2 * start + 1;
	let right = 2 * start + 2;
	if (left < heapSize[0] && heap[left].Priority < heap[smallest].Priority) {
		smallest = left;
	}
	if (right < heapSize[0] && heap[right].Priority < heap[smallest].Priority) {
		smallest = right;
	}

	// Ordering the Heap
	if (smallest !== start) {
		[heap[start], heap[smallest]] = [heap[smallest], heap[start]];
		Order(heap, heapSize, smallest);
	}
}

// Function to extract the process with the highest priority from the heap
function ExtractMinimum(heap, heapSize, currentTime) {
	let minProcess = heap[0];
	if (minProcess.ResponseTime === -1) {
		minProcess.ResponseTime = currentTime[0] - minProcess.ArrivalTime;
	}
	heapSize[0]--;
	if (heapSize[0] >= 1) {
		heap[0] = heap[heapSize[0]];
		Order(heap, heapSize, 0);
	}
	return minProcess;
}

// Function to compare two processes based on arrival time
function Compare(p1, p2) {
	return p1.ArrivalTime < p2.ArrivalTime;
}

// Function responsible for executing the highest priority process extracted from the heap
function Scheduling(heap, array, n, heapSize, currentTime) {
	if (heapSize[0] === 0) {
		return;
	}

	let minProcess = ExtractMinimum(heap, heapSize, currentTime);
	minProcess.OutTime = currentTime[0] + 1;
	minProcess.BurstTime--;

	console.log(`process id = ${minProcess.ProcessID} current time = ${currentTime[0]}`);

	// If the process is not yet finished, insert it back into the Heap
	if (minProcess.BurstTime > 0) {
		Insert(heap, minProcess, heapSize, currentTime);
		return;
	}

	for (let i = 0; i < n; i++) {
		if (array[i].ProcessID === minProcess.ProcessID) {
			array[i] = minProcess;
			break;
		}
	}
}

// Function responsible for managing the entire execution of processes based on arrival time
function Priority(array, n) {
	array.sort((p1, p2) => p1.ArrivalTime - p2.ArrivalTime);

	let totalWaitingTime = 0;
	let totalBurstTime = 0;
	let totalTurnaroundTime = 0;
	let insertedProcess = 0;
	let heapSize = [0];
	let currentTime = [array[0].ArrivalTime];
	let totalResponseTime = 0;

	let heap = Array(4 * n);

	// Calculating the total burst time of the processes
	for (let i = 0; i < n; i++) {
		totalBurstTime += array[i].BurstTime;
		array[i].TempBurstTime = array[i].BurstTime;
	}

	// Inserting the processes into Heap according to arrival time
	do {
		if (insertedProcess !== n) {
			for (let i = 0; i < n; i++) {
				if (array[i].ArrivalTime === currentTime[0]) {
					insertedProcess++;
					array[i].InTime = -1;
					array[i].ResponseTime = -1;
					Insert(heap, array[i], heapSize, currentTime);
				}
			}
		}
		Scheduling(heap, array, n, heapSize, currentTime);
		currentTime[0]++;
		if (heapSize[0] === 0 && insertedProcess === n) {
			break;
		}
	} while (true);

	for (let i = 0; i < n; i++) {
		totalResponseTime += array[i].ResponseTime;
		totalWaitingTime += (array[i].OutTime - array[i].InTime - array[i].TempBurstTime);
		totalTurnaroundTime += (array[i].OutTime - array[i].InTime);
		totalBurstTime += array[i].BurstTime;
	}

	console.log(`Average waiting time = ${totalWaitingTime / n}`);
	console.log(`Average response time = ${totalResponseTime / n}`);
	console.log(`Average turn around time = ${totalTurnaroundTime / n}`);
}

// Driver code
let n = 5;
let a = [
	new Process(1, 4, 2, 6),
	new Process(4, 5, 1, 3),
	new Process(2, 5, 3, 1),
	new Process(3, 1, 4, 2),
	new Process(5, 3, 5, 4)
];

Priority(a, n);
//This code is contributed by Kishan

```
:::

**输出**
```
process id = 3 current time = 1
process id = 3 current time = 2
process id = 5 current time = 3
process id = 1 current time = 4
process id = 4 current time = 5
process id = 4 current time = 6
process id = 4 current time = 7
process id = 1 current time = 8
process id = 1 current time = 9
process id = 1 current time = 10
process id = 1 current time = 11
process id = 1 current time = 12
process id = 2 current time = 13
process id = 5 current time = 14
process id = 5 current time = 15
process id = 5 current time = 16
Average waiting time = 4.200000
Average response time =1.600000
Average turn around time = 7.400000
```

输出显示进程在内存中的执行顺序，还显示每个进程的平均等待时间、平均响应时间和平均周转时间。