function linearSearchSteps(arr, target) {
  const steps = [];
  steps.push({ array: [...arr], pointers: {}, highlights: [], codeLine: 0, log: `Searching for ${target} in [${arr}]`, done: false });
  for (let i = 0; i < arr.length; i++) {
    steps.push({ array: [...arr], pointers: { i }, highlights: [i], codeLine: 1, log: `Checking index ${i}: value = ${arr[i]}`, done: false });
    if (arr[i] === target) {
      steps.push({ array: [...arr], pointers: { i }, highlights: [i], codeLine: 2, log: `Found ${target} at index ${i}!`, done: true });
      return steps;
    }
  }
  steps.push({ array: [...arr], pointers: {}, highlights: [], codeLine: 4, log: `${target} not found in array`, done: true });
  return steps;
}

function binarySearchSteps(arr, target) {
  const steps = [];
  let L = 0, R = arr.length - 1;
  steps.push({ array: [...arr], pointers: { L, R }, highlights: [], codeLine: 0, log: `Initialize L=${L}, R=${R}`, done: false });
  while (L <= R) {
    const M = Math.floor((L + R) / 2);
    steps.push({ array: [...arr], pointers: { L, M, R }, highlights: [M], codeLine: 1, log: `mid = floor((${L}+${R})/2) = ${M}`, done: false });
    if (arr[M] === target) {
      steps.push({ array: [...arr], pointers: { L, M, R }, highlights: [M], codeLine: 2, log: `arr[${M}] = ${arr[M]} == ${target}. Found!`, done: true });
      return steps;
    }
    if (arr[M] < target) {
      L = M + 1;
      steps.push({ array: [...arr], pointers: { L, R }, highlights: [], codeLine: 3, log: `${arr[M]} < ${target}, L = ${L}`, done: false });
    } else {
      R = M - 1;
      steps.push({ array: [...arr], pointers: { L, R }, highlights: [], codeLine: 4, log: `${arr[M]} > ${target}, R = ${R}`, done: false });
    }
  }
  steps.push({ array: [...arr], pointers: {}, highlights: [], codeLine: 5, log: `L (${L}) > R (${R}). Not found`, done: true });
  return steps;
}

function selectionSortSteps(arr) {
  const steps = [];
  const a = [...arr];
  steps.push({ array: [...a], pointers: {}, highlights: [], codeLine: 0, log: `Sorting [${a}]`, done: false });
  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    steps.push({ array: [...a], pointers: { i }, highlights: [i], codeLine: 1, log: `i=${i}, assume min at ${i} (${a[i]})`, done: false });
    for (let j = i + 1; j < a.length; j++) {
      steps.push({ array: [...a], pointers: { i, j, min: minIdx }, highlights: [j], codeLine: 2, log: `Compare a[${j}]=${a[j]} with a[${minIdx}]=${a[minIdx]}`, done: false });
      if (a[j] < a[minIdx]) {
        minIdx = j;
        steps.push({ array: [...a], pointers: { i, min: minIdx }, highlights: [minIdx], codeLine: 3, log: `New min at ${minIdx} (${a[minIdx]})`, done: false });
      }
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      steps.push({ array: [...a], pointers: { i }, highlights: [i, minIdx], codeLine: 4, log: `Swap a[${i}] <-> a[${minIdx}] => [${a}]`, done: false });
    }
  }
  steps.push({ array: [...a], pointers: {}, highlights: [], codeLine: 5, log: `Sorted: [${a}]`, done: true });
  return steps;
}

function twoPointerSteps(arr, target) {
  const steps = [];
  let L = 0, R = arr.length - 1;
  steps.push({ array: [...arr], pointers: { L, R }, highlights: [], codeLine: 0, log: `Find pair summing to ${target}`, done: false });
  while (L < R) {
    const sum = arr[L] + arr[R];
    steps.push({ array: [...arr], pointers: { L, R }, highlights: [L, R], codeLine: 1, log: `a[${L}]=${arr[L]} + a[${R}]=${arr[R]} = ${sum}`, done: false });
    if (sum === target) {
      steps.push({ array: [...arr], pointers: { L, R }, highlights: [L, R], codeLine: 2, log: `Found pair: (${arr[L]}, ${arr[R]})`, done: true });
      return steps;
    }
    if (sum < target) {
      L++;
      steps.push({ array: [...arr], pointers: { L, R }, highlights: [], codeLine: 3, log: `${sum} < ${target}, L = ${L}`, done: false });
    } else {
      R--;
      steps.push({ array: [...arr], pointers: { L, R }, highlights: [], codeLine: 4, log: `${sum} > ${target}, R = ${R}`, done: false });
    }
  }
  steps.push({ array: [...arr], pointers: {}, highlights: [], codeLine: 5, log: `No pair sums to ${target}`, done: true });
  return steps;
}

function slidingWindowSteps(arr, k) {
  const steps = [];
  let maxSum = 0, windowSum = 0, start = 0;
  steps.push({ array: [...arr], pointers: {}, highlights: [], codeLine: 0, log: `Find max sum of ${k} consecutive elements`, done: false });
  for (let end = 0; end < arr.length; end++) {
    windowSum += arr[end];
    steps.push({ array: [...arr], pointers: { start, end }, highlights: Array.from({ length: end - start + 1 }, (_, i) => start + i), codeLine: 1, log: `Add a[${end}]=${arr[end]}, window=[${arr.slice(start, end + 1)}], sum=${windowSum}`, done: false });
    if (end >= k - 1) {
      if (end === k - 1) {
        maxSum = windowSum;
        steps.push({ array: [...arr], pointers: { start, end }, highlights: Array.from({ length: k }, (_, i) => start + i), codeLine: 2, log: `First window sum=${windowSum}, maxSum=${maxSum}`, done: false });
      } else {
        maxSum = Math.max(maxSum, windowSum);
        steps.push({ array: [...arr], pointers: { start, end }, highlights: Array.from({ length: k }, (_, i) => start + i), codeLine: 3, log: `Sum=${windowSum}, maxSum=${maxSum}`, done: false });
      }
      windowSum -= arr[start];
      start++;
    }
  }
  steps.push({ array: [...arr], pointers: {}, highlights: [], codeLine: 4, log: `Maximum sum of ${k} consecutive elements = ${maxSum}`, done: true });
  return steps;
}

function stackSteps(arr) {
  const steps = [];
  const stack = [];
  steps.push({ array: [...arr], stack: [], pointers: {}, highlights: [], codeLine: 0, log: `Push each element, pop when we see a smaller value.`, done: false });
  for (let i = 0; i < arr.length; i++) {
    steps.push({ array: [...arr], stack: [...stack], pointers: { ptr: i }, highlights: [i], codeLine: 1, log: `Processing ${arr[i]}`, done: false });
    while (stack.length > 0 && arr[i] < stack[stack.length - 1]) {
      const popped = stack.pop();
      steps.push({ array: [...arr], stack: [...stack], pointers: { ptr: i }, highlights: [i], codeLine: 2, log: `Pop ${popped} (${arr[i]} < ${popped})`, done: false });
    }
    stack.push(arr[i]);
    steps.push({ array: [...arr], stack: [...stack], pointers: { ptr: i }, highlights: [i], codeLine: 3, log: `Push ${arr[i]} -> stack: [${stack}]`, done: false });
  }
  steps.push({ array: [...arr], stack: [...stack], pointers: {}, highlights: [], codeLine: 4, log: `Final stack: [${stack}]`, done: true });
  return steps;
}

function bfsGridSteps(arr) {
  const steps = [];
  const n = arr.length;
  const queue = [0];
  const visited = new Array(n).fill(false);
  visited[0] = true;
  steps.push({ array: [...arr], stack: [arr[0]], visited: [...visited], pointers: { q: 0 }, highlights: [0], codeLine: 0, log: `Start BFS from index 0 = ${arr[0]}`, done: false });
  while (queue.length > 0) {
    const idx = queue.shift();
    const left = 2 * idx + 1, right = 2 * idx + 2;
    steps.push({ array: [...arr], stack: Array.from(queue, i => arr[i]), visited: [...visited], pointers: { q: idx }, highlights: [idx], codeLine: 1, log: `Visit index ${idx} = ${arr[idx]}`, done: false });
    if (left < n && !visited[left]) { visited[left] = true; queue.push(left); steps.push({ array: [...arr], stack: Array.from(queue, i => arr[i]), visited: [...visited], pointers: {}, highlights: [left], codeLine: 2, log: `Enqueue left child index ${left} = ${arr[left]}`, done: false }); }
    if (right < n && !visited[right]) { visited[right] = true; queue.push(right); steps.push({ array: [...arr], stack: Array.from(queue, i => arr[i]), visited: [...visited], pointers: {}, highlights: [right], codeLine: 2, log: `Enqueue right child index ${right} = ${arr[right]}`, done: false }); }
  }
  steps.push({ array: [...arr], stack: [], visited: [...visited], pointers: {}, highlights: [], codeLine: 3, log: `BFS complete`, done: true });
  return steps;
}

function dfsGridSteps(arr) {
  const steps = [];
  const n = arr.length;
  const stackArr = [0];
  const visited = new Array(n).fill(false);
  steps.push({ array: [...arr], stack: [arr[0]], visited: [...visited], pointers: {}, highlights: [], codeLine: 0, log: `Start DFS from index 0`, done: false });
  while (stackArr.length > 0) {
    const idx = stackArr.pop();
    if (visited[idx]) continue;
    visited[idx] = true;
    const left = 2 * idx + 1, right = 2 * idx + 2;
    steps.push({ array: [...arr], stack: Array.from(stackArr, i => arr[i]), visited: [...visited], pointers: { cur: idx }, highlights: [idx], codeLine: 1, log: `Visit index ${idx} = ${arr[idx]}`, done: false });
    if (right < n && !visited[right]) { stackArr.push(right); steps.push({ array: [...arr], stack: Array.from(stackArr, i => arr[i]), visited: [...visited], pointers: {}, highlights: [right], codeLine: 2, log: `Push right child ${right} = ${arr[right]}`, done: false }); }
    if (left < n && !visited[left]) { stackArr.push(left); steps.push({ array: [...arr], stack: Array.from(stackArr, i => arr[i]), visited: [...visited], pointers: {}, highlights: [left], codeLine: 2, log: `Push left child ${left} = ${arr[left]}`, done: false }); }
  }
  steps.push({ array: [...arr], stack: [], visited: [...visited], pointers: {}, highlights: [], codeLine: 3, log: `DFS complete`, done: true });
  return steps;
}

function heapSteps(arr) {
  const steps = [];
  const a = [...arr];
  steps.push({ array: [...a], stack: [], pointers: {}, highlights: [], codeLine: 0, log: `Build min-heap and extract min`, done: false });

  function heapify(a, n, i) {
    let smallest = i;
    const L = 2 * i + 1, R = 2 * i + 2;
    steps.push({ array: [...a], stack: [], pointers: { parent: i }, highlights: [i, L < n ? L : -1, R < n ? R : -1].filter(x => x >= 0), codeLine: 1, log: `Heapify at index ${i}`, done: false });
    if (L < n && a[L] < a[smallest]) smallest = L;
    if (R < n && a[R] < a[smallest]) smallest = R;
    if (smallest !== i) {
      [a[i], a[smallest]] = [a[smallest], a[i]];
      steps.push({ array: [...a], stack: [], pointers: { parent: i, child: smallest }, highlights: [i, smallest], codeLine: 2, log: `Swap a[${i}] with a[${smallest}]`, done: false });
      heapify(a, n, smallest);
    }
  }

  for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) heapify(a, a.length, i);
  steps.push({ array: [...a], stack: [], pointers: {}, highlights: [], codeLine: 3, log: `Heap built: [${a}]`, done: false });

  const sorted = [];
  for (let i = a.length - 1; i >= 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    sorted.unshift(a[i]);
    steps.push({ array: [...a.slice(0, i)], stack: [...sorted], pointers: {}, highlights: [i], codeLine: 4, log: `Extract min: ${a[i]}`, done: false });
    heapify(a, i, 0);
  }
  steps.push({ array: [...a], stack: [...sorted], pointers: {}, highlights: [], codeLine: 5, log: `Sorted: [${sorted}]`, done: true });
  return steps;
}

export const visualizations = {
  'linear-search': {
    title: 'Linear Search',
    code: [
      'for i in range(len(arr)):',
      '  if arr[i] == target:',
      '    return i',
      'return -1',
    ],
    generateSteps: linearSearchSteps,
    defaultInput: { arr: [12, 45, 8, 23, 67, 3, 91, 56], target: 23 },
    description: 'Linear search scans each element sequentially until the target is found.',
    pointerMap: { i: { color: '#3b82f6', label: 'i' } },
  },
  'binary-search': {
    title: 'Binary Search',
    code: [
      'L, R = 0, len(arr) - 1',
      'while L <= R:',
      '  M = (L + R) // 2',
      '  if arr[M] == target: return M',
      '  if arr[M] < target: L = M + 1',
      '  else: R = M - 1',
      'return -1',
    ],
    generateSteps: binarySearchSteps,
    defaultInput: { arr: [12, 18, 24, 32, 45, 56, 78], target: 32 },
    description: 'Binary search repeatedly divides the sorted array in half to find the target.',
    pointerMap: { L: { color: '#ef4444', label: 'L' }, M: { color: '#f59e0b', label: 'M' }, R: { color: '#ef4444', label: 'R' } },
  },
  'selection-sort': {
    title: 'Selection Sort',
    code: [
      'for i in range(len(arr)-1):',
      '  minIdx = i',
      '  for j in range(i+1, len(arr)):',
      '    if arr[j] < arr[minIdx]:',
      '      minIdx = j',
      '  swap arr[i], arr[minIdx]',
      'return arr',
    ],
    generateSteps: selectionSortSteps,
    defaultInput: { arr: [29, 10, 14, 37, 13, 33] },
    description: 'Selection sort repeatedly finds the minimum element and moves it to the front.',
    pointerMap: { i: { color: '#3b82f6', label: 'i' }, j: { color: '#8b5cf6', label: 'j' }, min: { color: '#10b981', label: 'min' } },
  },
  'two-pointers': {
    title: 'Two Pointers',
    code: [
      'L, R = 0, len(arr) - 1',
      'while L < R:',
      '  sum = arr[L] + arr[R]',
      '  if sum == target: return (L, R)',
      '  if sum < target: L += 1',
      '  else: R -= 1',
      'return -1',
    ],
    generateSteps: twoPointerSteps,
    defaultInput: { arr: [2, 7, 11, 15, 22, 30], target: 26 },
    description: 'Two pointers scan from both ends to find a pair summing to the target.',
    pointerMap: { L: { color: '#3b82f6', label: 'L' }, R: { color: '#ef4444', label: 'R' } },
  },
  'sliding-window': {
    title: 'Sliding Window',
    code: [
      'maxSum = 0, windowSum = 0, start = 0',
      'for end in range(len(arr)):',
      '  windowSum += arr[end]',
      '  if end >= k - 1:',
      '    maxSum = max(maxSum, windowSum)',
      '    windowSum -= arr[start]',
      '    start += 1',
      'return maxSum',
    ],
    generateSteps: slidingWindowSteps,
    defaultInput: { arr: [2, 1, 5, 1, 3, 2, 6, 1], k: 3 },
    description: 'Sliding window maintains a running sum over a fixed-size window.',
    pointerMap: { start: { color: '#3b82f6', label: 'start' }, end: { color: '#ef4444', label: 'end' } },
  },
  'stack': {
    title: 'Monotonic Stack',
    code: [
      'stack = []',
      'for each num in arr:',
      '  while stack and num < stack.top:',
      '    stack.pop()',
      '  stack.push(num)',
      'return stack',
    ],
    generateSteps: stackSteps,
    defaultInput: { arr: [4, 2, 5, 1, 3] },
    description: 'Monotonic stack maintains a sorted stack by popping smaller elements.',
    pointerMap: { ptr: { color: '#3b82f6', label: 'ptr' } },
  },
  'bfs': {
    title: 'BFS Grid Traversal',
    code: [
      'queue = [(0, 0)], visited = set()',
      'while queue:',
      '  r, c = queue.pop(0)',
      '  for dr, dc in directions:',
      '    if in_bounds and not visited:',
      '      visited.add((nr, nc))',
      '      queue.append((nr, nc))',
    ],
    generateSteps: bfsGridSteps,
    defaultInput: { arr: [1, 2, 3, 4, 5, 6, 7] },
    description: 'BFS explores a tree level by level using a queue.',
    pointerMap: { q: { color: '#3b82f6', label: 'q' } },
  },
  'dfs': {
    title: 'DFS Tree Traversal',
    code: [
      'stack = [root], visited = set()',
      'while stack:',
      '  node = stack.pop()',
      '  if visited: continue',
      '  visited.add(node)',
      '  push children right, then left',
    ],
    generateSteps: dfsGridSteps,
    defaultInput: { arr: [1, 2, 3, 4, 5, 6, 7] },
    description: 'DFS explores a tree depth-first using a stack.',
    pointerMap: { cur: { color: '#f59e0b', label: 'cur' } },
  },
  'heap': {
    title: 'Min Heap',
    code: [
      'for i in range(n//2-1, -1, -1):',
      '  heapify(arr, n, i)',
      'for i in range(n-1, 0, -1):',
      '  swap arr[0], arr[i]',
      '  heapify(arr, i, 0)',
    ],
    generateSteps: heapSteps,
    defaultInput: { arr: [9, 4, 7, 1, 3, 8] },
    description: 'Heap sort builds a min-heap then extracts elements in sorted order.',
    pointerMap: { parent: { color: '#f59e0b', label: 'parent' }, child: { color: '#ef4444', label: 'child' } },
  },
};
