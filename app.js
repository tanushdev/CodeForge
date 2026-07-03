const resources = [
  {
    title: "GFG DSA Tutorial",
    kind: "Guide",
    url: "https://www.geeksforgeeks.org/learn-data-structures-and-algorithms-dsa-tutorial/",
  },
  {
    title: "GFG DSA with Python",
    kind: "Python",
    url: "https://www.geeksforgeeks.org/python-data-structures-and-algorithms/",
  },
  {
    title: "LeetCode Problems",
    kind: "Practice",
    url: "https://leetcode.com/problemset/algorithms/",
  },
  {
    title: "HackerRank Python",
    kind: "Practice",
    url: "https://www.hackerrank.com/domains/python",
  },
  {
    title: "NeetCode Roadmap",
    kind: "Video + problems",
    url: "https://neetcode.io/roadmap",
  },
  {
    title: "freeCodeCamp DSA Python",
    kind: "Video",
    url: "https://www.youtube.com/results?search_query=freecodecamp+data+structures+and+algorithms+python",
  },
  {
    title: "DSA Handwritten Notes",
    kind: "Notes",
    url: "DSA-Handwritten-Notes.pdf",
  },
];

const algorithmGuide = [
  {
    name: "Linear scan",
    useWhen: "Need one pass over values, maximum/minimum, count, or running state.",
    why: "It is the simplest O(n) option and avoids extra memory unless the state requires it.",
    time: "O(n)",
    space: "O(1)",
    examples: "maximum subarray, stock profit, count positives",
  },
  {
    name: "Hash map / set",
    useWhen: "Repeated lookup, frequency count, duplicates, complements, grouping.",
    why: "Average O(1) lookup turns many nested-loop questions into one-pass solutions.",
    time: "O(n) average",
    space: "O(n)",
    examples: "two sum, anagrams, longest consecutive sequence",
  },
  {
    name: "Two pointers",
    useWhen: "Sorted array/string, pair search, palindrome, partitioning.",
    why: "Pointer movement discards impossible answers without checking every pair.",
    time: "O(n)",
    space: "O(1)",
    examples: "3Sum, container water, valid palindrome",
  },
  {
    name: "Sliding window",
    useWhen: "Contiguous subarray/substring with max/min length, sum, or frequency constraint.",
    why: "Maintains a valid window instead of recomputing every range.",
    time: "O(n)",
    space: "O(k)",
    examples: "longest substring, min window, max consecutive ones",
  },
  {
    name: "Binary search",
    useWhen: "Sorted data or a monotonic yes/no answer space.",
    why: "Halves the search space; powerful for 'minimum possible maximum' problems.",
    time: "O(log n) or O(n log answer)",
    space: "O(1)",
    examples: "rotated array, Koko bananas, split array largest sum",
  },
  {
    name: "Stack / monotonic stack",
    useWhen: "Need previous/next greater/smaller, nested expressions, undo-style state.",
    why: "Keeps only useful candidates and removes dominated values.",
    time: "O(n)",
    space: "O(n)",
    examples: "daily temperatures, histogram, parentheses",
  },
  {
    name: "BFS",
    useWhen: "Shortest path in unweighted graph, levels, minimum steps.",
    why: "Processes nodes by distance, so first visit is shortest.",
    time: "O(V + E)",
    space: "O(V)",
    examples: "rotting oranges, word ladder, graph levels",
  },
  {
    name: "DFS / backtracking",
    useWhen: "Explore all paths, components, recursion trees, choices with undo.",
    why: "Natural for exhaustive search, tree traversal, and connected components.",
    time: "O(V + E) for graph DFS; exponential for choices",
    space: "O(depth)",
    examples: "islands, subsets, word search",
  },
  {
    name: "Heap / priority queue",
    useWhen: "Need top K, dynamic minimum/maximum, repeated best candidate.",
    why: "Keeps best candidate accessible without fully sorting every update.",
    time: "O(n log k) or O(n log n)",
    space: "O(k) to O(n)",
    examples: "top K, merge K lists, task scheduler",
  },
  {
    name: "Dynamic programming",
    useWhen: "Overlapping subproblems with optimal substructure: choose/skip, prefixes, grids.",
    why: "Stores solved states so recursion does not repeat the same work.",
    time: "states x transition cost",
    space: "number of states",
    examples: "knapsack, LCS, coin change, house robber",
  },
  {
    name: "Greedy",
    useWhen: "Local best choice can be proven to preserve global optimum.",
    why: "Usually faster and simpler than DP, but requires a proof.",
    time: "Often O(n) or O(n log n)",
    space: "Usually O(1)",
    examples: "jump game, intervals, gas station",
  },
  {
    name: "Union find / DSU",
    useWhen: "Connectivity changes through union operations.",
    why: "Near-constant find/union with path compression and rank.",
    time: "O(alpha(n)) per operation",
    space: "O(n)",
    examples: "redundant connection, provinces, Kruskal MST",
  },
  {
    name: "Trie",
    useWhen: "Prefix search, dictionary words, autocomplete, word board pruning.",
    why: "Shares common prefixes and avoids scanning every word repeatedly.",
    time: "O(length of word)",
    space: "O(total characters)",
    examples: "implement trie, word search II, suggestions",
  },
  {
    name: "Segment tree / Fenwick tree",
    useWhen: "Many range queries and point/range updates.",
    why: "Balances update and query work when prefix sums are not enough.",
    time: "O(log n) query/update",
    space: "O(n)",
    examples: "range sum mutable, count smaller, calendars",
  },
];

const sortingGuide = [
  {
    name: "Python Timsort",
    useWhen: "Default choice in interviews and real Python code: list.sort() or sorted().",
    why: "Stable, highly optimized, excellent on partially sorted data.",
    time: "O(n log n), O(n) best",
    space: "O(n)",
    examples: "custom comparator, intervals, sorting records",
  },
  {
    name: "Merge sort",
    useWhen: "Need guaranteed O(n log n), stable sorting, or linked-list sorting.",
    why: "Divide and conquer with predictable performance.",
    time: "O(n log n)",
    space: "O(n), O(log n) recursion for linked list",
    examples: "sort list, count inversions",
  },
  {
    name: "Quick sort",
    useWhen: "Conceptual sorting, partition logic, quickselect variants.",
    why: "Fast average case, but bad pivots can degrade.",
    time: "O(n log n) average, O(n^2) worst",
    space: "O(log n) average",
    examples: "partition array, quickselect kth largest",
  },
  {
    name: "Heap sort",
    useWhen: "Need O(1) extra memory and guaranteed O(n log n).",
    why: "Heap property repeatedly extracts max/min.",
    time: "O(n log n)",
    space: "O(1) in-place",
    examples: "priority scheduling, top K foundation",
  },
  {
    name: "Counting sort",
    useWhen: "Integer keys in a small known range.",
    why: "Avoids comparison sorting when value range is limited.",
    time: "O(n + k)",
    space: "O(k)",
    examples: "sort colors, frequency ranking",
  },
];

const numericalLabs = [
  {
    title: "Two Sum with hash map",
    input: "nums = [2, 7, 11, 15], target = 9",
    steps: [
      "Start with empty map: {}.",
      "At 2, need 7. Store 2 -> index 0.",
      "At 7, need 2. 2 is already in the map.",
      "Return indices [0, 1].",
    ],
    pattern: "Hash map complement lookup",
    complexity: "Time O(n), space O(n).",
  },
  {
    title: "Sliding window maximum length",
    input: "s = 'abcabcbb'",
    steps: [
      "Keep left pointer and last seen index map.",
      "Read a, b, c: window abc has length 3.",
      "Read a again: move left after previous a.",
      "Best remains 3 because abc is the longest unique window.",
    ],
    pattern: "Variable sliding window",
    complexity: "Time O(n), space O(k) where k is character set size.",
  },
  {
    title: "Binary search on answer",
    input: "piles = [3, 6, 7, 11], h = 8",
    steps: [
      "Search speed from 1 to 11.",
      "Try mid 6: hours = 1 + 1 + 2 + 2 = 6, possible.",
      "Try smaller speeds; speed 4 gives 8 hours, possible.",
      "Speed 3 gives 10 hours, not possible. Answer is 4.",
    ],
    pattern: "Monotonic possible/impossible boundary",
    complexity: "Time O(n log maxPile), space O(1).",
  },
  {
    title: "Dijkstra shortest path",
    input: "Edges: A-B 4, A-C 1, C-B 2, B-D 1, C-D 5",
    steps: [
      "Start A distance 0. Push neighbors B=4, C=1.",
      "Pop C=1. Relax B to 3 and D to 6.",
      "Pop B=3. Relax D to 4.",
      "Pop D=4. Shortest A to D is 4 through A-C-B-D.",
    ],
    pattern: "Heap-based shortest path for non-negative weights",
    complexity: "Time O((V + E) log V), space O(V + E).",
  },
  {
    title: "0/1 knapsack DP",
    input: "weights = [1, 3, 4], values = [15, 20, 30], capacity = 4",
    steps: [
      "State dp[c] means best value at capacity c.",
      "Process each item from capacity down to weight.",
      "Item weight 1 gives dp[1..4] = 15.",
      "Item weight 3 can combine with weight 1: dp[4] = 35.",
      "Item weight 4 alone gives 30, so best remains 35.",
    ],
    pattern: "Choose/skip dynamic programming",
    complexity: "Time O(n * capacity), space O(capacity).",
  },
  {
    title: "Merge intervals",
    input: "intervals = [[1,3], [2,6], [8,10], [15,18]]",
    steps: [
      "Sort by start time.",
      "Start merged list with [1,3].",
      "[2,6] overlaps, extend to [1,6].",
      "[8,10] and [15,18] do not overlap, append them.",
    ],
    pattern: "Sorting plus linear scan",
    complexity: "Time O(n log n), space O(n).",
  },
];

const lessons = [
  {
    title: "Linear search",
    level: "Level 1",
    xp: 50,
    use: "Use when data is unsorted and you must inspect items one by one.",
    complexity: "Time O(n), space O(1)",
    theory:
      "Linear search teaches the basic interview habit: scan, compare, return. It is not fancy, but every bigger algorithm still depends on careful loops and boundaries.",
    code: `def linear_search(nums, target):
    for i in range(0, len(nums)):
        if nums[i] == target:
            return i
    return -1`,
    explanation: [
      "Define a function that receives the array and the value we want.",
      "Loop i from 0 to n - 1 so every index is checked exactly once.",
      "Compare the current value nums[i] with target.",
      "If equal, return the index immediately because the target is found.",
      "If the loop finishes, target never appeared, so return -1.",
    ],
    equation: "Worst case comparisons = n. If target is at index k, comparisons = k + 1.",
    practice: [lc("Binary Search", "easy", "binary-search"), lc("Search Insert Position", "easy", "search-insert-position")],
  },
  {
    title: "Selection sort",
    level: "Level 2",
    xp: 75,
    use: "Use only for learning sorting mechanics or tiny arrays.",
    complexity: "Time O(n^2), space O(1)",
    theory:
      "Selection sort repeatedly selects the smallest remaining value and places it at the front. It is slow, but it makes sorting invariants very clear.",
    code: `def selection_sort(nums):
    n = len(nums)
    for i in range(0, n):
        min_index = i
        for j in range(i + 1, n):
            if nums[j] < nums[min_index]:
                min_index = j
        temp = nums[i]
        nums[i] = nums[min_index]
        nums[min_index] = temp
    return nums`,
    explanation: [
      "Store n so loop limits are clear.",
      "Position i is the slot we are currently fixing.",
      "Assume the smallest remaining value is at i.",
      "Scan the unsorted area from i + 1 to n - 1.",
      "If a smaller value is found, remember its index.",
      "Swap nums[i] with the smallest value found.",
      "After each outer loop, nums[0..i] is sorted.",
    ],
    equation: "Comparisons = (n - 1) + (n - 2) + ... + 1 = n(n - 1)/2.",
    practice: [lc("Sort an Array", "medium", "sort-an-array"), lc("Sort Colors", "medium", "sort-colors")],
  },
  {
    title: "Merge sort",
    level: "Level 3",
    xp: 100,
    use: "Use when you need guaranteed O(n log n), stable sorting, or divide-and-conquer practice.",
    complexity: "Time O(n log n), space O(n)",
    theory:
      "Merge sort splits the array until pieces are tiny, then merges sorted pieces. It is the cleanest way to understand divide and conquer.",
    code: `def merge_sort(nums):
    if len(nums) <= 1:
        return nums

    mid = len(nums) // 2
    left = merge_sort(nums[0:mid])
    right = merge_sort(nums[mid:len(nums)])

    i = 0
    j = 0
    merged = []

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1

    while i < len(left):
        merged.append(left[i])
        i += 1

    while j < len(right):
        merged.append(right[j])
        j += 1

    return merged`,
    explanation: [
      "If the list has 0 or 1 items, it is already sorted.",
      "Split the list into left and right halves.",
      "Recursively sort each half.",
      "Use two pointers i and j to compare sorted halves.",
      "Append the smaller current value into merged.",
      "Copy leftover left values because right is exhausted.",
      "Copy leftover right values because left is exhausted.",
      "Return the fully merged sorted list.",
    ],
    equation: "T(n) = 2T(n/2) + n, so T(n) = O(n log n).",
    practice: [lc("Sort List", "medium", "sort-list"), gfg("Inversion Count", "Medium", "inversion-count-in-array-1587115620")],
  },
  {
    title: "Binary search",
    level: "Level 4",
    xp: 100,
    use: "Use on sorted data or a monotonic answer space.",
    complexity: "Time O(log n), space O(1)",
    theory:
      "Binary search works because each comparison removes half of the remaining possibilities. The key is preserving the search boundary invariant.",
    code: `def binary_search(nums, target):
    left = 0
    right = len(nums) - 1

    while left <= right:
        mid = left + (right - left) // 2

        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1`,
    explanation: [
      "left and right define the current possible search range.",
      "The loop continues while the range is valid.",
      "mid is calculated without overflow in languages with fixed integers.",
      "If nums[mid] is target, return mid.",
      "If nums[mid] is too small, discard the left half including mid.",
      "If nums[mid] is too large, discard the right half including mid.",
      "If no range remains, target is absent.",
    ],
    equation: "After k checks, remaining size is n / 2^k. Stop when n / 2^k = 1, so k = log2(n).",
    practice: [lc("Search in Rotated Sorted Array", "medium", "search-in-rotated-sorted-array"), lc("Koko Eating Bananas", "medium", "koko-eating-bananas")],
  },
  {
    title: "Two pointers",
    level: "Level 5",
    xp: 100,
    use: "Use for sorted pair problems, palindrome checks, and opposite-end movement.",
    complexity: "Time O(n), space O(1)",
    theory:
      "Two pointers are about deleting impossible choices. In a sorted array, if a sum is too small, moving the right pointer left cannot help; you must move left forward.",
    code: `def two_sum_sorted(nums, target):
    left = 0
    right = len(nums) - 1

    while left < right:
        current_sum = nums[left] + nums[right]

        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1

    return [-1, -1]`,
    explanation: [
      "Start with the smallest and largest values.",
      "Compute their sum.",
      "If the sum matches target, return both indices.",
      "If sum is too small, increase it by moving left forward.",
      "If sum is too large, decrease it by moving right backward.",
      "If pointers cross, no valid pair exists.",
    ],
    equation: "Each step moves left or right once. Total moves <= n - 1.",
    practice: [lc("3Sum", "medium", "3sum"), lc("Container With Most Water", "medium", "container-with-most-water")],
  },
  {
    title: "Sliding window",
    level: "Level 6",
    xp: 125,
    use: "Use for contiguous subarray or substring problems.",
    complexity: "Time O(n), space O(k)",
    theory:
      "Sliding window keeps a live range. Instead of recomputing every substring, you expand right and shrink left until the invariant is valid.",
    code: `def longest_unique_substring(s):
    seen = {}
    left = 0
    best = 0

    for right in range(0, len(s)):
        char = s[right]

        if char in seen and seen[char] >= left:
            left = seen[char] + 1

        seen[char] = right
        window_length = right - left + 1

        if window_length > best:
            best = window_length

    return best`,
    explanation: [
      "seen stores the latest index of each character.",
      "left marks the start of the current unique window.",
      "right expands the window one character at a time.",
      "If char was seen inside the current window, move left after it.",
      "Update char's latest index.",
      "Current window length is right - left + 1.",
      "Store the best length seen so far.",
    ],
    equation: "Window length = right - left + 1. Each pointer moves at most n times.",
    practice: [lc("Longest Substring Without Repeating Characters", "medium", "longest-substring-without-repeating-characters"), lc("Minimum Window Substring", "hard", "minimum-window-substring")],
  },
  {
    title: "BFS shortest path",
    level: "Level 7",
    xp: 125,
    use: "Use for minimum steps in an unweighted graph or grid.",
    complexity: "Time O(V + E), space O(V)",
    theory:
      "BFS visits nodes layer by layer. That is why the first time you reach a node, you reached it with the fewest edges.",
    code: `def bfs_shortest_path(graph, start, target):
    queue = [(start, 0)]
    visited = set()
    visited.add(start)
    head = 0

    while head < len(queue):
        node, distance = queue[head]
        head += 1

        if node == target:
            return distance

        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, distance + 1))

    return -1`,
    explanation: [
      "Queue stores node and distance from start.",
      "visited prevents cycles and repeated work.",
      "head simulates queue pop without using deque.",
      "Read the current node from the queue.",
      "If it is target, return the shortest distance.",
      "Visit every neighbor not already seen.",
      "Neighbor distance is current distance + 1.",
    ],
    equation: "Each vertex enters the queue once and each edge is checked once: O(V + E).",
    practice: [lc("Rotting Oranges", "medium", "rotting-oranges"), lc("Word Ladder", "hard", "word-ladder")],
  },
  {
    title: "DFS recursion",
    level: "Level 8",
    xp: 125,
    use: "Use for components, trees, paths, and exhaustive exploration.",
    complexity: "Time O(V + E), space O(depth)",
    theory:
      "DFS goes as deep as possible before returning. The important skill is defining what each recursive call promises to do.",
    code: `def count_islands(grid):
    rows = len(grid)
    cols = len(grid[0])

    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return
        if grid[r][c] != "1":
            return

        grid[r][c] = "0"
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    islands = 0
    for r in range(0, rows):
        for c in range(0, cols):
            if grid[r][c] == "1":
                islands += 1
                dfs(r, c)

    return islands`,
    explanation: [
      "Store grid dimensions for boundary checks.",
      "dfs(r, c) removes one connected land component.",
      "Out-of-bound cells stop recursion.",
      "Water or already visited cells stop recursion.",
      "Mark land as water so it is not counted again.",
      "Explore four neighboring directions.",
      "Every time a fresh land cell is found, count one island and erase it.",
    ],
    equation: "Every cell is visited at most once, so time = rows x cols.",
    practice: [lc("Number of Islands", "medium", "number-of-islands"), lc("Max Area of Island", "medium", "max-area-of-island")],
  },
  {
    title: "Min heap",
    level: "Level 9",
    xp: 150,
    use: "Use when repeatedly needing the smallest or top K values.",
    complexity: "Push/pop O(log n), peek O(1)",
    theory:
      "A heap is a tree stored in an array. For min-heap, parent <= children. We bubble values up and down to maintain that property.",
    code: `def heap_push(heap, value):
    heap.append(value)
    index = len(heap) - 1

    while index > 0:
        parent = (index - 1) // 2
        if heap[parent] <= heap[index]:
            break
        temp = heap[parent]
        heap[parent] = heap[index]
        heap[index] = temp
        index = parent`,
    explanation: [
      "Append value at the end to preserve complete tree shape.",
      "index points to the inserted value.",
      "Parent index formula is (index - 1) // 2.",
      "If parent is already smaller, heap property is valid.",
      "Otherwise swap parent and child.",
      "Continue bubbling up until root or valid position.",
    ],
    equation: "Heap height = log2(n), so one push takes O(log n).",
    practice: [lc("Kth Largest Element in an Array", "medium", "kth-largest-element-in-an-array"), lc("Find Median from Data Stream", "hard", "find-median-from-data-stream")],
  },
  {
    title: "Dynamic programming",
    level: "Level 10",
    xp: 175,
    use: "Use when choices repeat the same subproblems.",
    complexity: "Time = number of states x transition cost",
    theory:
      "DP is not magic. It is recursion with memory. Define the state, write the recurrence, set base cases, then compute in a safe order.",
    code: `def coin_change(coins, amount):
    impossible = amount + 1
    dp = [impossible] * (amount + 1)
    dp[0] = 0

    for value in range(1, amount + 1):
        for coin in coins:
            if value - coin >= 0:
                candidate = dp[value - coin] + 1
                if candidate < dp[value]:
                    dp[value] = candidate

    if dp[amount] == impossible:
        return -1
    return dp[amount]`,
    explanation: [
      "dp[value] means minimum coins needed to build value.",
      "amount + 1 is impossible because no answer needs more than amount coins of value 1.",
      "dp[0] is 0 because zero coins make amount zero.",
      "Try every amount from small to large.",
      "For each coin, check if it can be the last coin used.",
      "candidate means best way to make previous amount plus this coin.",
      "Keep the smaller coin count.",
      "Return -1 if amount was never reached.",
    ],
    equation: "Recurrence: dp[x] = min(dp[x], dp[x - coin] + 1).",
    practice: [lc("Coin Change", "medium", "coin-change"), lc("Longest Common Subsequence", "medium", "longest-common-subsequence")],
  },
  {
    title: "Union find",
    level: "Level 11",
    xp: 150,
    use: "Use for grouping, connectivity, and cycle detection in undirected graphs.",
    complexity: "Almost O(1) per operation with compression",
    theory:
      "Union find keeps each component as a set with a representative parent. Path compression flattens the tree whenever find is called.",
    code: `def find(parent, x):
    if parent[x] != x:
        parent[x] = find(parent, parent[x])
    return parent[x]

def union(parent, rank, a, b):
    root_a = find(parent, a)
    root_b = find(parent, b)

    if root_a == root_b:
        return False

    if rank[root_a] < rank[root_b]:
        parent[root_a] = root_b
    elif rank[root_a] > rank[root_b]:
        parent[root_b] = root_a
    else:
        parent[root_b] = root_a
        rank[root_a] += 1

    return True`,
    explanation: [
      "find returns the representative parent of x.",
      "If x is not its own parent, recursively find the real root.",
      "Store the root directly in parent[x] to compress the path.",
      "union gets both component roots.",
      "If roots match, a and b are already connected.",
      "Attach smaller-rank tree under larger-rank tree.",
      "If ranks tie, choose one root and increase its rank.",
    ],
    equation: "With path compression and rank, amortized time is O(alpha(n)), nearly constant.",
    practice: [lc("Redundant Connection", "medium", "redundant-connection"), lc("Number of Provinces", "medium", "number-of-provinces")],
  },
  {
    title: "Backtracking",
    level: "Level 12",
    xp: 175,
    use: "Use when the problem asks for all valid combinations, permutations, paths, or choices.",
    complexity: "Usually exponential, based on branching factor and depth",
    theory:
      "Backtracking is controlled brute force. You choose, explore, then undo so the next branch starts clean.",
    code: `def subsets(nums):
    result = []
    path = []

    def backtrack(index):
        if index == len(nums):
            result.append(path[:])
            return

        path.append(nums[index])
        backtrack(index + 1)
        path.pop()

        backtrack(index + 1)

    backtrack(0)
    return result`,
    explanation: [
      "result stores all final subsets.",
      "path stores the current subset being built.",
      "index says which number we are deciding about.",
      "If index reaches n, save a copy of path.",
      "Choose nums[index] by appending it.",
      "Explore the include branch.",
      "Undo the choice with pop.",
      "Explore the exclude branch.",
    ],
    equation: "Each element has 2 choices, include or exclude, so total subsets = 2^n.",
    practice: [lc("Subsets", "medium", "subsets"), lc("N-Queens", "hard", "n-queens")],
  },
  {
    title: "Trie",
    level: "Level 13",
    xp: 150,
    use: "Use for prefix search, dictionary words, autocomplete, and word board pruning.",
    complexity: "Insert/search O(L), space O(total characters)",
    theory:
      "A trie (prefix tree) shares common prefixes so no character is stored more than once per path. Each node stores children and a flag marking the end of a word.",
    code: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True

    def search(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end

    def starts_with(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True`,
    explanation: [
      "TrieNode stores children in a dict and a boolean end marker.",
      "Trie holds a root TrieNode that starts empty.",
      "insert walks through word characters, creating nodes as needed.",
      "The last node is marked as the end of a word.",
      "search follows characters; returns False if a character is missing.",
      "Returns True only if the final node is a word end.",
      "starts_with follows characters like search, but returns True as long as the prefix exists.",
    ],
    equation: "Time per operation = O(L) where L is word length. Space = O(alpha * L) for each unique word.",
    practice: [lc("Implement Trie", "medium", "implement-trie-prefix-tree"), lc("Word Search II", "hard", "word-search-ii")],
  },
  {
    title: "Dijkstra's algorithm",
    level: "Level 14",
    xp: 175,
    use: "Use for shortest paths in weighted graphs with non-negative edges.",
    complexity: "Time O((V + E) log V), space O(V)",
    theory:
      "Dijkstra greedily visits the closest unvisited node, relaxing all its outgoing edges. A priority queue ensures the next closest node is always popped first.",
    code: `import heapq

def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]

    while pq:
        current_distance, node = heapq.heappop(pq)

        if current_distance > distances[node]:
            continue

        for neighbor, weight in graph[node]:
            distance = current_distance + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))

    return distances`,
    explanation: [
      "Initialize all distances to infinity except the start at 0.",
      "Use a min-heap to always expand the closest unprocessed node.",
      "Pop the node with the smallest known distance.",
      "If the popped distance is stale (larger than stored), skip it.",
      "For each neighbor, calculate the new distance through the current node.",
      "If the new distance is smaller, update and push to the heap.",
      "When the heap empties, all reachable distances are final.",
    ],
    equation: "Each edge is relaxed once, and each heap operation is O(log V), so total = O((V + E) log V).",
    practice: [lc("Network Delay Time", "medium", "network-delay-time"), lc("Cheapest Flights Within K Stops", "medium", "cheapest-flights-within-k-stops")],
  },
  {
    title: "Segment tree",
    level: "Level 15",
    xp: 200,
    use: "Use for range queries with point or range updates on arrays.",
    complexity: "Build O(n), query O(log n), update O(log n)",
    theory:
      "A segment tree stores aggregate information (sum, min, max) over array segments. Each node represents a range, and its children represent the left and right halves.",
    code: `class SegmentTree:
    def __init__(self, nums):
        self.n = len(nums)
        self.tree = [0] * (4 * self.n)
        self._build(nums, 0, 0, self.n - 1)

    def _build(self, nums, node, left, right):
        if left == right:
            self.tree[node] = nums[left]
            return
        mid = (left + right) // 2
        self._build(nums, 2 * node + 1, left, mid)
        self._build(nums, 2 * node + 2, mid + 1, right)
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]

    def range_sum(self, ql, qr):
        return self._query(0, 0, self.n - 1, ql, qr)

    def _query(self, node, left, right, ql, qr):
        if ql > right or qr < left:
            return 0
        if ql <= left and right <= qr:
            return self.tree[node]
        mid = (left + right) // 2
        return self._query(2 * node + 1, left, mid, ql, qr) + self._query(2 * node + 2, mid + 1, right, ql, qr)`,
    explanation: [
      "The tree array has size 4n for safety.",
      "Build recursively: leaf stores the value, internal nodes sum children.",
      "range_sum traverses the tree, returning 0 for disjoint ranges.",
      "If a node range is fully inside the query, return its stored value.",
      "Otherwise, recurse into children and combine results.",
      "Update follows the same path to leaf, then recomputes upward.",
    ],
    equation: "Tree height = log2 n. Both query and update visit O(log n) nodes.",
    practice: [lc("Range Sum Query - Mutable", "medium", "range-sum-query-mutable"), lc("Count of Smaller Numbers After Self", "hard", "count-of-smaller-numbers-after-self")],
  },
];

const lessonEnhancements = {
  "Linear search": {
    deepNotes: [
      "Linear search means checking values one by one from left to right. It is the fallback when the data has no useful order.",
      "It is used for unsorted arrays, small inputs, or when every element must be inspected anyway.",
      "The loop invariant is: before index i, every earlier value has already been checked and is not the target.",
      "The worst case happens when the target is last or missing, so the algorithm performs n comparisons.",
    ],
    dryRun: [
      "nums = [4, 9, 1, 7], target = 7.",
      "i = 0: nums[0] = 4, not target.",
      "i = 1: nums[1] = 9, not target.",
      "i = 2: nums[2] = 1, not target.",
      "i = 3: nums[3] = 7, target found, return 3.",
    ],
    interview: [
      "I will scan every element because the array is unsorted.",
      "If I find the target, I return its index immediately.",
      "If the scan ends, the target does not exist, so I return -1.",
    ],
  },
  "Selection sort": {
    deepNotes: [
      "Sorting means arranging data in an order, usually ascending or descending. We sort to make searching, merging, duplicate handling, interval logic, and greedy choices easier.",
      "Selection sort divides the array into two zones: sorted left side and unsorted right side.",
      "At step i, it finds the smallest value in the unsorted zone and swaps it into position i.",
      "Why O(n^2)? For n items, the inner scan checks roughly n + (n - 1) + ... + 1 positions, which equals n(n - 1)/2.",
      "Why not use it in real coding? It is simple but slow. In Python, sorted() uses Timsort, but selection sort is excellent for understanding swaps and invariants.",
    ],
    dryRun: [
      "nums = [5, 2, 4, 1].",
      "i = 0: smallest in [5,2,4,1] is 1. Swap 5 and 1 -> [1,2,4,5].",
      "i = 1: smallest in [2,4,5] is 2. No real change -> [1,2,4,5].",
      "i = 2: smallest in [4,5] is 4. No change.",
      "i = 3: one item left. Array is sorted.",
    ],
    interview: [
      "I keep the prefix sorted after every outer loop.",
      "The algorithm is in-place because it swaps inside the same array.",
      "It is not stable by default because swapping can move equal elements past each other.",
    ],
  },
  "Merge sort": {
    deepNotes: [
      "Merge sort is a divide-and-conquer sorting algorithm: split, solve smaller pieces, merge results.",
      "It is used when predictable O(n log n) time matters, especially for linked lists, inversion count, and stable sorting ideas.",
      "The merge step is the heart: two sorted arrays can be combined in linear time using two pointers.",
      "Why O(n log n)? The array is split into log n levels, and every level merges all n elements.",
      "Space is O(n) because merged arrays store copied values.",
    ],
    dryRun: [
      "[8,3,5,2] splits into [8,3] and [5,2].",
      "[8,3] becomes [8] and [3], then merges into [3,8].",
      "[5,2] becomes [5] and [2], then merges into [2,5].",
      "Merge [3,8] and [2,5]: choose 2, then 3, then 5, then 8.",
      "Final sorted array is [2,3,5,8].",
    ],
    interview: [
      "I choose merge sort when I want guaranteed O(n log n).",
      "The recurrence is T(n) = 2T(n/2) + O(n).",
      "The tradeoff is extra memory for merging.",
    ],
  },
  "Binary search": {
    deepNotes: [
      "Binary search is used when the answer space is sorted or monotonic.",
      "Monotonic means once an answer becomes possible, all larger answers may also be possible, or the reverse.",
      "The power comes from deleting half the search space after every comparison.",
      "Boundary bugs are common, so always define what left and right mean before coding.",
    ],
    dryRun: [
      "nums = [1,3,5,7,9], target = 7.",
      "left = 0, right = 4, mid = 2, nums[mid] = 5.",
      "5 is too small, so search right half: left = 3.",
      "mid = 3, nums[mid] = 7, return index 3.",
    ],
    interview: [
      "I can use binary search because the array is sorted.",
      "Each comparison removes half the candidates.",
      "Time is O(log n) because the range halves repeatedly.",
    ],
  },
  "Two pointers": {
    deepNotes: [
      "Two pointers are used when moving one boundary gives a predictable effect.",
      "In sorted pair-sum problems, moving left increases the sum and moving right decreases it.",
      "The algorithm works because every pointer move removes a group of impossible pairs.",
    ],
    dryRun: [
      "nums = [1,2,4,6,10], target = 8.",
      "left = 0, right = 4, sum = 11, too large, move right.",
      "left = 0, right = 3, sum = 7, too small, move left.",
      "left = 1, right = 3, sum = 8, return [1,3].",
    ],
    interview: [
      "I use two pointers because the array is sorted.",
      "I move the pointer that can fix the current sum.",
      "Each index is visited at most once, so time is O(n).",
    ],
  },
  "Sliding window": {
    deepNotes: [
      "Sliding window is for contiguous ranges: subarrays and substrings.",
      "Fixed window questions keep the same size. Variable window questions expand and shrink based on a rule.",
      "The invariant is the condition that must be true for the current window, such as 'no duplicates' or 'sum <= k'.",
    ],
    dryRun: [
      "s = 'abba'.",
      "Read a: window 'a', best = 1.",
      "Read b: window 'ab', best = 2.",
      "Read b again: duplicate inside window, move left after old b.",
      "Window becomes 'b', then read a -> 'ba', best remains 2.",
    ],
    interview: [
      "I maintain a valid window instead of checking all substrings.",
      "The formula for length is right - left + 1.",
      "Both pointers move forward only, so total time is O(n).",
    ],
  },
  "BFS shortest path": {
    deepNotes: [
      "BFS means breadth-first search. It explores all nodes at distance 1, then distance 2, then distance 3.",
      "It is used for minimum steps in unweighted graphs because the first time a node is reached, it is reached optimally.",
      "A queue is required because older discovered nodes must be processed before newer deeper nodes.",
    ],
    dryRun: [
      "Graph: A -> B, C; B -> D; C -> D.",
      "Queue starts with A at distance 0.",
      "Visit A, push B and C with distance 1.",
      "Visit B, push D with distance 2.",
      "D is reached in 2 edges, which is shortest.",
    ],
    interview: [
      "I choose BFS because all edges have equal weight.",
      "I store visited nodes to prevent cycles.",
      "Time is O(V + E) because every node and edge is processed once.",
    ],
  },
  "DFS recursion": {
    deepNotes: [
      "DFS means depth-first search. It explores one path fully before trying another path.",
      "It is used for connected components, trees, backtracking, and path exploration.",
      "The recursive function should have a clear contract: what it processes and when it stops.",
    ],
    dryRun: [
      "Grid island starts at cell (0,0).",
      "Mark (0,0) visited.",
      "Move down, up, right, left recursively.",
      "Every connected land cell becomes visited.",
      "When recursion ends, one full island has been removed.",
    ],
    interview: [
      "I use DFS to consume an entire connected component.",
      "Base cases stop out-of-bound, water, or visited cells.",
      "Each cell is touched once, so grid time is O(rows * cols).",
    ],
  },
  "Min heap": {
    deepNotes: [
      "A heap is a complete binary tree stored inside an array.",
      "In a min heap, every parent is smaller than or equal to its children.",
      "It is used when the next smallest item must be found repeatedly without sorting everything again.",
      "The parent-child equations are parent = (i - 1) // 2, left = 2i + 1, right = 2i + 2.",
    ],
    dryRun: [
      "heap = [3, 8, 5], push 2.",
      "Append 2 -> [3,8,5,2].",
      "Parent of index 3 is index 1, value 8. Swap -> [3,2,5,8].",
      "Parent of index 1 is index 0, value 3. Swap -> [2,3,5,8].",
      "2 is root, heap property restored.",
    ],
    interview: [
      "I use a heap for top K or repeated best candidate questions.",
      "Push and pop are O(log n) because heap height is log n.",
      "Peek is O(1) because the minimum is at index 0.",
    ],
  },
  "Dynamic programming": {
    deepNotes: [
      "DP is used when brute force repeats the same subproblems.",
      "The most important step is defining state: dp[x] must have a precise meaning.",
      "Then write the recurrence, base case, and order of computation.",
      "If you cannot explain the state in one sentence, do not code yet.",
    ],
    dryRun: [
      "coins = [1,2,5], amount = 5.",
      "dp[0] = 0 because zero coins make zero.",
      "dp[1] = 1 using coin 1.",
      "dp[2] = 1 using coin 2.",
      "dp[5] = min(dp[4]+1, dp[3]+1, dp[0]+1) = 1 using coin 5.",
    ],
    interview: [
      "I define dp[value] as the minimum coins needed for value.",
      "For each coin, I try making value - coin first, then add one coin.",
      "The recurrence is dp[x] = min(dp[x], dp[x - coin] + 1).",
    ],
  },
  "Union find": {
    deepNotes: [
      "Union find manages groups and answers whether two items are already connected.",
      "It is used for undirected graph cycles, components, Kruskal MST, and account merging.",
      "Path compression makes future find calls faster by pointing nodes directly to the root.",
      "Union by rank keeps trees shallow.",
    ],
    dryRun: [
      "parent = [0,1,2,3].",
      "union(0,1) makes 1 point to 0.",
      "union(2,3) makes 3 point to 2.",
      "union(1,3) connects roots 0 and 2.",
      "Now 0,1,2,3 are one component.",
    ],
    interview: [
      "I use DSU because connectivity changes through union operations.",
      "If two nodes already share a root, adding their edge creates a cycle.",
      "Amortized time is almost constant with compression and rank.",
    ],
  },
  Backtracking: {
    deepNotes: [
      "Backtracking is used when you must explore many possible choices and collect valid results.",
      "The pattern is choose, explore, undo.",
      "Undoing is critical because the same path list is reused across branches.",
      "Time is usually exponential because the algorithm explores a decision tree.",
    ],
    dryRun: [
      "nums = [1,2].",
      "Choose 1, choose 2 -> subset [1,2].",
      "Undo 2 -> subset [1].",
      "Undo 1, choose 2 -> subset [2].",
      "Choose nothing -> subset [].",
    ],
    interview: [
      "I use backtracking because the problem asks for all combinations.",
      "Each recursive level makes a decision.",
      "I append a copy of the path because path will keep changing.",
    ],
  },
  Trie: {
    deepNotes: [
      "A trie is a tree where each node represents a single character of a word.",
      "Common prefixes share nodes, so 'top' and 'topology' share 't', 'o', 'p' before diverging.",
      "The children are stored in a dict for flexibility, or an array of 26 for lowercase letters.",
      "Tries are used for autocomplete, spell check, IP routing, and word-search puzzles.",
      "Time complexity per operation is O(L) regardless of how many words are stored.",
    ],
    dryRun: [
      "Insert 'cat', 'car', 'dog' into an empty trie.",
      "Root has children: c and d.",
      "Node c has child a, and node a has child t (end) and child r (end).",
      "Node d has child o, and node o has child g (end).",
      "Search 'car': follow c -> a -> r, return True (end marker).",
      "Search 'can': follow c -> a, then n is missing, return False.",
    ],
    interview: [
      "I use a trie when the problem involves prefix matching or dictionary word lookup.",
      "Each node uses a dict for children, which makes code clean and handles any character.",
      "Search and insert both run in O(L) time, independent of dictionary size.",
    ],
  },
  "Dijkstra's algorithm": {
    deepNotes: [
      "Dijkstra works only for non-negative edge weights because it assumes settled distances are final.",
      "The algorithm maintains a tentative distance for each node and always expands the closest unsettled node.",
      "A priority queue (min-heap) is the standard implementation choice.",
      "Negative weights require Bellman-Ford; Dijkstra would produce wrong answers.",
    ],
    dryRun: [
      "Graph: A-B(4), A-C(1), C-B(2), B-D(1), C-D(5).",
      "Start A at 0. Push neighbors: B=4, C=1.",
      "Pop C=1. Relax B to 3, D to 6.",
      "Pop B=3. Relax D to 4.",
      "Pop D=4. Shortest A to D is 4 via A-C-B-D.",
    ],
    interview: [
      "I choose Dijkstra for shortest paths when all weights are non-negative.",
      "The heap ensures we always process the closest unvisited node next.",
      "Time is O((V + E) log V) because each edge triggers at most one heap push.",
    ],
  },
  "Segment tree": {
    deepNotes: [
      "A segment tree is a binary tree used for range queries on mutable arrays.",
      "Each node represents an interval [left, right] and stores aggregate info for that interval.",
      "The tree is stored in an array where node i has children 2i+1 and 2i+2.",
      "Building takes O(n), and each query or update takes O(log n).",
      "Fenwick tree (BIT) is simpler but limited to prefix operations.",
    ],
    dryRun: [
      "nums = [1, 3, 5, 7, 9, 11].",
      "Build tree: leaves store [1],[3],[5],[7],[9],[11].",
      "Parents: [4], [12], [20] (sums of consecutive pairs).",
      "Root = [36].",
      "Query sum [2..4]: combine leaf [5] + [7] + [9] = 21.",
    ],
    interview: [
      "I use a segment tree when I need many range sum/max/min queries with updates.",
      "The implementation uses a 4n array to cover any binary tree shape.",
      "Recursive traversal combines child results into the parent answer.",
    ],
  },
};

const roadmap = [
  {
    level: "Phase 1",
    title: "Python coding foundations",
    topics: [
      topic("Python syntax for DSA", "important", "Loops, functions, list/dict/set/tuple, input parsing, slicing.", "Use list comprehensions, enumerate, zip, defaultdict, Counter, deque, heapq, bisect.", [
        prompt("Explain list vs tuple vs set vs dict with Big O."),
        prompt("Write clean input parsing for multiple test cases."),
      ], [
        lc("Two Sum", "easy", "two-sum"),
        hr("Python If-Else", "Easy", "python-if-else"),
        gfg("Python Lists", "School", "python-list"),
      ]),
      topic("Complexity analysis", "important", "Big O, Big Omega, amortized thinking, recursion trees.", "Annotate every solution with time and space before submitting.", [
        prompt("Why is nested loop sometimes not O(n^2)?"),
        prompt("Analyze sorting plus one linear scan."),
      ], [
        gfg("Analysis of Algorithms", "Basic", "analysis-of-algorithms-set-1-asymptotic-analysis"),
        lc("Maximum Subarray", "medium", "maximum-subarray"),
      ]),
      topic("Math and bit basics", "core", "GCD, primes, modulo, powers, XOR, bit masks.", "Use math.gcd, pow(a, b, mod), bit_count, and careful overflow-free logic.", [
        prompt("Find single number using XOR."),
        prompt("Check prime and discuss complexity."),
      ], [
        lc("Single Number", "easy", "single-number"),
        lc("Counting Bits", "easy", "counting-bits"),
        gfg("Sieve of Eratosthenes", "Easy", "sieve-of-eratosthenes"),
      ]),
    ],
  },
  {
    level: "Phase 2",
    title: "Arrays, strings, hashing",
    topics: [
      topic("Arrays and prefix sums", "important", "Subarray sums, difference arrays, Kadane, in-place transforms.", "Prefer O(n) scans with running state and exact boundary names.", [
        prompt("Maximum subarray and why Kadane works."),
        prompt("Use prefix sums to count subarrays with sum k."),
      ], [
        lc("Product of Array Except Self", "medium", "product-of-array-except-self"),
        lc("Subarray Sum Equals K", "medium", "subarray-sum-equals-k"),
        gfg("Equilibrium Point", "Easy", "equilibrium-point-1"),
      ]),
      topic("Strings", "important", "Anagrams, palindromes, parsing, matching, rolling ideas.", "Use Counter for clarity, then optimize only when needed.", [
        prompt("Group anagrams and explain key construction."),
        prompt("Longest substring without repeating characters."),
      ], [
        lc("Valid Anagram", "easy", "valid-anagram"),
        lc("Group Anagrams", "medium", "group-anagrams"),
        lc("Longest Substring Without Repeating Characters", "medium", "longest-substring-without-repeating-characters"),
      ]),
      topic("Hash maps and sets", "important", "Frequency, membership, deduplication, two-sum family.", "Reach for dict/set first when repeated lookup is the bottleneck.", [
        prompt("Design a frequency map and handle collisions conceptually."),
        prompt("Find longest consecutive sequence in O(n)."),
      ], [
        lc("Contains Duplicate", "easy", "contains-duplicate"),
        lc("Longest Consecutive Sequence", "medium", "longest-consecutive-sequence"),
        hr("Hash Tables: Ransom Note", "Easy", "ctci-ransom-note"),
      ]),
    ],
  },
  {
    level: "Phase 3",
    title: "Pointers, windows, binary search",
    topics: [
      topic("Two pointers", "important", "Opposite ends, fast/slow, sorted pair logic.", "Name left/right clearly and prove why movement is safe.", [
        prompt("3Sum without duplicate triplets."),
        prompt("Container with most water movement rule."),
      ], [
        lc("Valid Palindrome", "easy", "valid-palindrome"),
        lc("3Sum", "medium", "3sum"),
        lc("Container With Most Water", "medium", "container-with-most-water"),
      ]),
      topic("Sliding window", "important", "Fixed window, variable window, at-most/exactly conversion.", "Use while loops to restore invariants before updating best answer.", [
        prompt("Minimum window substring invariant."),
        prompt("Longest replacement after at most k changes."),
      ], [
        lc("Best Time to Buy and Sell Stock", "easy", "best-time-to-buy-and-sell-stock"),
        lc("Longest Repeating Character Replacement", "medium", "longest-repeating-character-replacement"),
        lc("Minimum Window Substring", "hard", "minimum-window-substring"),
      ]),
      topic("Binary search", "important", "Index search, answer search, rotated arrays, bounds.", "Use bisect for library-aware Python, but practice manual templates.", [
        prompt("Find minimum in rotated sorted array."),
        prompt("Binary search on answer for capacity/speed problems."),
      ], [
        lc("Binary Search", "easy", "binary-search"),
        lc("Search in Rotated Sorted Array", "medium", "search-in-rotated-sorted-array"),
        lc("Koko Eating Bananas", "medium", "koko-eating-bananas"),
      ]),
    ],
  },
  {
    level: "Phase 4",
    title: "Linked lists, stacks, queues",
    topics: [
      topic("Linked lists", "important", "Reverse, merge, cycle, remove nth, dummy nodes.", "Use dummy nodes and draw pointer changes before coding.", [
        prompt("Reverse a linked list iteratively and recursively."),
        prompt("Detect cycle and find entry point."),
      ], [
        lc("Reverse Linked List", "easy", "reverse-linked-list"),
        lc("Merge Two Sorted Lists", "easy", "merge-two-sorted-lists"),
        lc("Linked List Cycle", "easy", "linked-list-cycle"),
      ]),
      topic("Stacks and monotonic stacks", "important", "Parentheses, temperatures, histogram, next greater.", "Store indices when distance or width matters.", [
        prompt("Daily temperatures and why indices are stored."),
        prompt("Largest rectangle in histogram."),
      ], [
        lc("Valid Parentheses", "easy", "valid-parentheses"),
        lc("Daily Temperatures", "medium", "daily-temperatures"),
        lc("Largest Rectangle in Histogram", "hard", "largest-rectangle-in-histogram"),
      ]),
      topic("Queues and deques", "core", "BFS queues, sliding maximum, circular buffers.", "Use collections.deque for O(1) push/pop both ends.", [
        prompt("Sliding window maximum with a monotonic deque."),
        prompt("Level-order traversal queue design."),
      ], [
        lc("Sliding Window Maximum", "hard", "sliding-window-maximum"),
        hr("Queue using Two Stacks", "Medium", "queue-using-two-stacks"),
      ]),
    ],
  },
  {
    level: "Phase 5",
    title: "Trees, BST, heaps, tries",
    topics: [
      topic("Binary trees", "important", "DFS, BFS, height, diameter, LCA, serialization.", "Practice recursive return values and iterative stack versions.", [
        prompt("Diameter of binary tree return contract."),
        prompt("Lowest common ancestor in a binary tree."),
      ], [
        lc("Maximum Depth of Binary Tree", "easy", "maximum-depth-of-binary-tree"),
        lc("Diameter of Binary Tree", "easy", "diameter-of-binary-tree"),
        lc("Binary Tree Level Order Traversal", "medium", "binary-tree-level-order-traversal"),
      ]),
      topic("BST", "important", "Validate, search, kth, LCA, inorder ordering.", "Use bounds for validation and inorder for sorted sequence problems.", [
        prompt("Validate BST with min/max bounds."),
        prompt("Kth smallest using iterative inorder."),
      ], [
        lc("Validate Binary Search Tree", "medium", "validate-binary-search-tree"),
        lc("Kth Smallest Element in a BST", "medium", "kth-smallest-element-in-a-bst"),
      ]),
      topic("Heaps and priority queues", "important", "Top K, streaming, scheduling, merge K.", "Use heapq min-heap; push negative values for max-heap behavior.", [
        prompt("Top K frequent elements tradeoffs."),
        prompt("Merge K sorted lists with heap entries."),
      ], [
        lc("Kth Largest Element in an Array", "medium", "kth-largest-element-in-an-array"),
        lc("Top K Frequent Elements", "medium", "top-k-frequent-elements"),
        lc("Merge k Sorted Lists", "hard", "merge-k-sorted-lists"),
      ]),
      topic("Tries", "advanced", "Prefix tree, search suggestions, word dictionary.", "Use nested dicts or node classes; mark terminal words explicitly.", [
        prompt("Implement Trie insert/search/startsWith."),
        prompt("Word search with trie plus backtracking."),
      ], [
        lc("Implement Trie", "medium", "implement-trie-prefix-tree"),
        lc("Word Search II", "hard", "word-search-ii"),
      ]),
    ],
  },
  {
    level: "Phase 6",
    title: "Graphs and disjoint sets",
    topics: [
      topic("BFS and DFS graphs", "important", "Components, islands, shortest unweighted paths.", "Use visited sets; avoid mutating input unless intentional.", [
        prompt("Number of islands with grid DFS/BFS."),
        prompt("Clone graph using hashmap."),
      ], [
        lc("Number of Islands", "medium", "number-of-islands"),
        lc("Clone Graph", "medium", "clone-graph"),
        hr("BFS Shortest Reach", "Medium", "bfsshortreach"),
      ]),
      topic("Topological sort", "important", "DAG ordering, prerequisites, cycle detection.", "Know both DFS colors and Kahn's indegree queue.", [
        prompt("Course schedule cycle detection."),
        prompt("Return a valid ordering if possible."),
      ], [
        lc("Course Schedule", "medium", "course-schedule"),
        lc("Course Schedule II", "medium", "course-schedule-ii"),
      ]),
      topic("Shortest paths and MST", "advanced", "Dijkstra, Bellman-Ford idea, Prim, Kruskal.", "Use heapq for Dijkstra and DSU for Kruskal.", [
        prompt("Network delay time with Dijkstra."),
        prompt("Minimum cost to connect points."),
      ], [
        lc("Network Delay Time", "medium", "network-delay-time"),
        lc("Cheapest Flights Within K Stops", "medium", "cheapest-flights-within-k-stops"),
        lc("Min Cost to Connect All Points", "medium", "min-cost-to-connect-all-points"),
      ]),
      topic("Disjoint set union", "advanced", "Union-find, path compression, rank/size.", "Write find with compression until it is muscle memory.", [
        prompt("Detect redundant connection."),
        prompt("Count connected components with DSU."),
      ], [
        lc("Redundant Connection", "medium", "redundant-connection"),
        lc("Accounts Merge", "medium", "accounts-merge"),
      ]),
    ],
  },
  {
    level: "Phase 7",
    title: "Greedy, backtracking, dynamic programming",
    topics: [
      topic("Greedy", "important", "Local choice proofs, intervals, jumps, scheduling.", "Always state why the local choice cannot hurt the future.", [
        prompt("Jump Game greedy reach."),
        prompt("Non-overlapping intervals removal."),
      ], [
        lc("Jump Game", "medium", "jump-game"),
        lc("Gas Station", "medium", "gas-station"),
        lc("Non-overlapping Intervals", "medium", "non-overlapping-intervals"),
      ]),
      topic("Backtracking", "important", "Subsets, permutations, combinations, constraint search.", "Use choose, explore, unchoose and prune early.", [
        prompt("Generate subsets and discuss recursion tree."),
        prompt("N-Queens constraints using sets."),
      ], [
        lc("Subsets", "medium", "subsets"),
        lc("Combination Sum", "medium", "combination-sum"),
        lc("N-Queens", "hard", "n-queens"),
      ]),
      topic("1D and 2D dynamic programming", "important", "Memoization, tabulation, state definition, transitions.", "Write state meaning before code; then transition and base cases.", [
        prompt("House robber state transition."),
        prompt("Longest common subsequence table meaning."),
      ], [
        lc("Climbing Stairs", "easy", "climbing-stairs"),
        lc("House Robber", "medium", "house-robber"),
        lc("Longest Common Subsequence", "medium", "longest-common-subsequence"),
      ]),
      topic("Advanced DP", "advanced", "Knapsack, interval DP, bitmask DP, tree DP.", "Start memoized, then compress only when the table shape is obvious.", [
        prompt("Partition equal subset sum as knapsack."),
        prompt("Burst balloons interval DP."),
      ], [
        lc("Partition Equal Subset Sum", "medium", "partition-equal-subset-sum"),
        lc("Coin Change", "medium", "coin-change"),
        lc("Burst Balloons", "hard", "burst-balloons"),
      ]),
    ],
  },
  {
    level: "Phase 8",
    title: "Advanced structures and interview polish",
    topics: [
      topic("Segment tree and Fenwick tree", "advanced", "Range query/update, prefix frequency, coordinate compression.", "Know when a sorted list, heap, or prefix sum is enough before using trees.", [
        prompt("Range sum query mutable."),
        prompt("Count smaller numbers after self."),
      ], [
        lc("Range Sum Query - Mutable", "medium", "range-sum-query-mutable"),
        lc("Count of Smaller Numbers After Self", "hard", "count-of-smaller-numbers-after-self"),
      ]),
      topic("Design questions", "important", "LRU, randomized set, time map, rate limiter style thinking.", "Use Python OrderedDict/dict carefully, but know the linked-list design too.", [
        prompt("Implement LRU cache and explain O(1)."),
        prompt("Design insert/delete/getRandom in O(1)."),
      ], [
        lc("LRU Cache", "medium", "lru-cache"),
        lc("Insert Delete GetRandom O(1)", "medium", "insert-delete-getrandom-o1"),
        lc("Time Based Key-Value Store", "medium", "time-based-key-value-store"),
      ]),
      topic("Mock interview execution", "important", "Clarify, brute force, optimize, code, dry run, test.", "Speak in invariants and tradeoffs; keep code simple and typed where helpful.", [
        prompt("Explain an optimized solution before coding."),
        prompt("Dry run on empty, one-item, duplicate, and large cases."),
      ], [
        lc("Blind 75 Discussion List", "mixed", "https://leetcode.com/discuss/post/522206/blind-curated-75-list-with-difficulty-level/", true),
        lc("Top Interview Questions", "mixed", "https://leetcode.com/problem-list/top-interview-questions/", true),
      ]),
    ],
  },
];

const masteryProblems = {
  "Python syntax for DSA": [
    hr("Arithmetic Operators", "Easy", "python-arithmetic-operators"),
    hr("Loops", "Easy", "python-loops"),
    hr("List Comprehensions", "Easy", "list-comprehensions"),
    hr("Find the Runner-Up Score", "Easy", "find-second-maximum-number-in-a-list"),
    hr("Nested Lists", "Easy", "nested-list"),
  ],
  "Complexity analysis": [
    gfg("Complexity Cheat Sheet", "Basic", "analysis-of-algorithms-set-4-analysis-of-loops"),
    lc("Running Sum of 1d Array", "easy", "running-sum-of-1d-array"),
    lc("Richest Customer Wealth", "easy", "richest-customer-wealth"),
  ],
  "Math and bit basics": [
    lc("Power of Two", "easy", "power-of-two"),
    lc("Reverse Bits", "easy", "reverse-bits"),
    lc("Missing Number", "easy", "missing-number"),
    lc("Sum of Two Integers", "medium", "sum-of-two-integers"),
    lc("Reverse Integer", "medium", "reverse-integer"),
  ],
  "Arrays and prefix sums": [
    lc("Merge Sorted Array", "easy", "merge-sorted-array"),
    lc("Move Zeroes", "easy", "move-zeroes"),
    lc("Find Pivot Index", "easy", "find-pivot-index"),
    lc("Maximum Product Subarray", "medium", "maximum-product-subarray"),
    lc("Minimum Size Subarray Sum", "medium", "minimum-size-subarray-sum"),
    lc("Range Sum Query - Immutable", "easy", "range-sum-query-immutable"),
    lc("Insert Interval", "medium", "insert-interval"),
    lc("Merge Intervals", "medium", "merge-intervals"),
  ],
  Strings: [
    lc("Valid Palindrome II", "easy", "valid-palindrome-ii"),
    lc("Encode and Decode Strings", "medium", "encode-and-decode-strings"),
    lc("Palindromic Substrings", "medium", "palindromic-substrings"),
    lc("Longest Palindromic Substring", "medium", "longest-palindromic-substring"),
    lc("String to Integer atoi", "medium", "string-to-integer-atoi"),
    lc("Find All Anagrams in a String", "medium", "find-all-anagrams-in-a-string"),
  ],
  "Hash maps and sets": [
    lc("Isomorphic Strings", "easy", "isomorphic-strings"),
    lc("Happy Number", "easy", "happy-number"),
    lc("Valid Sudoku", "medium", "valid-sudoku"),
    lc("Four Sum II", "medium", "4sum-ii"),
    lc("First Missing Positive", "hard", "first-missing-positive"),
    hr("Sherlock and Anagrams", "Medium", "sherlock-and-anagrams"),
  ],
  "Two pointers": [
    lc("Remove Duplicates from Sorted Array", "easy", "remove-duplicates-from-sorted-array"),
    lc("Two Sum II", "medium", "two-sum-ii-input-array-is-sorted"),
    lc("Sort Colors", "medium", "sort-colors"),
    lc("Trapping Rain Water", "hard", "trapping-rain-water"),
    lc("4Sum", "medium", "4sum"),
  ],
  "Sliding window": [
    lc("Permutation in String", "medium", "permutation-in-string"),
    lc("Maximum Average Subarray I", "easy", "maximum-average-subarray-i"),
    lc("Max Consecutive Ones III", "medium", "max-consecutive-ones-iii"),
    lc("Fruit Into Baskets", "medium", "fruit-into-baskets"),
    lc("Subarrays with K Different Integers", "hard", "subarrays-with-k-different-integers"),
  ],
  "Binary search": [
    lc("First Bad Version", "easy", "first-bad-version"),
    lc("Find Peak Element", "medium", "find-peak-element"),
    lc("Find First and Last Position", "medium", "find-first-and-last-position-of-element-in-sorted-array"),
    lc("Search a 2D Matrix", "medium", "search-a-2d-matrix"),
    lc("Median of Two Sorted Arrays", "hard", "median-of-two-sorted-arrays"),
    lc("Split Array Largest Sum", "hard", "split-array-largest-sum"),
  ],
  "Linked lists": [
    lc("Palindrome Linked List", "easy", "palindrome-linked-list"),
    lc("Remove Nth Node From End of List", "medium", "remove-nth-node-from-end-of-list"),
    lc("Reorder List", "medium", "reorder-list"),
    lc("Add Two Numbers", "medium", "add-two-numbers"),
    lc("Copy List with Random Pointer", "medium", "copy-list-with-random-pointer"),
    lc("Reverse Nodes in k-Group", "hard", "reverse-nodes-in-k-group"),
  ],
  "Stacks and monotonic stacks": [
    lc("Min Stack", "medium", "min-stack"),
    lc("Evaluate Reverse Polish Notation", "medium", "evaluate-reverse-polish-notation"),
    lc("Car Fleet", "medium", "car-fleet"),
    lc("Remove K Digits", "medium", "remove-k-digits"),
    lc("Basic Calculator", "hard", "basic-calculator"),
  ],
  "Queues and deques": [
    lc("Implement Queue using Stacks", "easy", "implement-queue-using-stacks"),
    lc("Design Circular Queue", "medium", "design-circular-queue"),
    lc("Number of Recent Calls", "easy", "number-of-recent-calls"),
    lc("Shortest Subarray with Sum at Least K", "hard", "shortest-subarray-with-sum-at-least-k"),
  ],
  "Binary trees": [
    lc("Invert Binary Tree", "easy", "invert-binary-tree"),
    lc("Same Tree", "easy", "same-tree"),
    lc("Subtree of Another Tree", "easy", "subtree-of-another-tree"),
    lc("Balanced Binary Tree", "easy", "balanced-binary-tree"),
    lc("Binary Tree Right Side View", "medium", "binary-tree-right-side-view"),
    lc("Count Good Nodes in Binary Tree", "medium", "count-good-nodes-in-binary-tree"),
    lc("Construct Binary Tree from Preorder and Inorder", "medium", "construct-binary-tree-from-preorder-and-inorder-traversal"),
    lc("Serialize and Deserialize Binary Tree", "hard", "serialize-and-deserialize-binary-tree"),
    lc("Binary Tree Maximum Path Sum", "hard", "binary-tree-maximum-path-sum"),
  ],
  BST: [
    lc("Lowest Common Ancestor of a BST", "medium", "lowest-common-ancestor-of-a-binary-search-tree"),
    lc("Convert Sorted Array to BST", "easy", "convert-sorted-array-to-binary-search-tree"),
    lc("Delete Node in a BST", "medium", "delete-node-in-a-bst"),
    lc("Recover Binary Search Tree", "medium", "recover-binary-search-tree"),
  ],
  "Heaps and priority queues": [
    lc("Last Stone Weight", "easy", "last-stone-weight"),
    lc("K Closest Points to Origin", "medium", "k-closest-points-to-origin"),
    lc("Task Scheduler", "medium", "task-scheduler"),
    lc("Find Median from Data Stream", "hard", "find-median-from-data-stream"),
    lc("IPO", "hard", "ipo"),
  ],
  Tries: [
    lc("Design Add and Search Words", "medium", "design-add-and-search-words-data-structure"),
    lc("Search Suggestions System", "medium", "search-suggestions-system"),
    lc("Replace Words", "medium", "replace-words"),
    lc("Maximum XOR of Two Numbers", "medium", "maximum-xor-of-two-numbers-in-an-array"),
  ],
  "BFS and DFS graphs": [
    lc("Flood Fill", "easy", "flood-fill"),
    lc("Max Area of Island", "medium", "max-area-of-island"),
    lc("Pacific Atlantic Water Flow", "medium", "pacific-atlantic-water-flow"),
    lc("Surrounded Regions", "medium", "surrounded-regions"),
    lc("Rotting Oranges", "medium", "rotting-oranges"),
    lc("Walls and Gates", "medium", "walls-and-gates"),
    lc("Word Ladder", "hard", "word-ladder"),
  ],
  "Topological sort": [
    lc("Alien Dictionary", "hard", "alien-dictionary"),
    lc("Minimum Height Trees", "medium", "minimum-height-trees"),
    lc("Find Eventual Safe States", "medium", "find-eventual-safe-states"),
    lc("Parallel Courses", "medium", "parallel-courses"),
  ],
  "Shortest paths and MST": [
    lc("Path With Minimum Effort", "medium", "path-with-minimum-effort"),
    lc("Swim in Rising Water", "hard", "swim-in-rising-water"),
    lc("Reconstruct Itinerary", "hard", "reconstruct-itinerary"),
    lc("Find Critical and Pseudo-Critical Edges", "hard", "find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree"),
  ],
  "Disjoint set union": [
    lc("Number of Provinces", "medium", "number-of-provinces"),
    lc("Satisfiability of Equality Equations", "medium", "satisfiability-of-equality-equations"),
    lc("Graph Valid Tree", "medium", "graph-valid-tree"),
    lc("Most Stones Removed with Same Row or Column", "medium", "most-stones-removed-with-same-row-or-column"),
    lc("Making A Large Island", "hard", "making-a-large-island"),
  ],
  Greedy: [
    lc("Assign Cookies", "easy", "assign-cookies"),
    lc("Can Place Flowers", "easy", "can-place-flowers"),
    lc("Partition Labels", "medium", "partition-labels"),
    lc("Queue Reconstruction by Height", "medium", "queue-reconstruction-by-height"),
    lc("Hand of Straights", "medium", "hand-of-straights"),
    lc("Candy", "hard", "candy"),
  ],
  Backtracking: [
    lc("Permutations", "medium", "permutations"),
    lc("Subsets II", "medium", "subsets-ii"),
    lc("Palindrome Partitioning", "medium", "palindrome-partitioning"),
    lc("Word Search", "medium", "word-search"),
    lc("Letter Combinations of a Phone Number", "medium", "letter-combinations-of-a-phone-number"),
    lc("Sudoku Solver", "hard", "sudoku-solver"),
  ],
  "1D and 2D dynamic programming": [
    lc("Min Cost Climbing Stairs", "easy", "min-cost-climbing-stairs"),
    lc("Unique Paths", "medium", "unique-paths"),
    lc("Longest Increasing Subsequence", "medium", "longest-increasing-subsequence"),
    lc("Word Break", "medium", "word-break"),
    lc("Decode Ways", "medium", "decode-ways"),
    lc("Edit Distance", "medium", "edit-distance"),
    lc("Interleaving String", "medium", "interleaving-string"),
    lc("Regular Expression Matching", "hard", "regular-expression-matching"),
  ],
  "Advanced DP": [
    lc("Target Sum", "medium", "target-sum"),
    lc("Longest Palindromic Subsequence", "medium", "longest-palindromic-subsequence"),
    lc("Best Time to Buy and Sell Stock with Cooldown", "medium", "best-time-to-buy-and-sell-stock-with-cooldown"),
    lc("Best Time to Buy and Sell Stock IV", "hard", "best-time-to-buy-and-sell-stock-iv"),
    lc("Distinct Subsequences", "hard", "distinct-subsequences"),
    lc("Minimum Window Subsequence", "hard", "minimum-window-subsequence"),
    lc("Stone Game", "medium", "stone-game"),
  ],
  "Segment tree and Fenwick tree": [
    lc("Count of Range Sum", "hard", "count-of-range-sum"),
    lc("My Calendar I", "medium", "my-calendar-i"),
    lc("My Calendar III", "hard", "my-calendar-iii"),
    lc("Falling Squares", "hard", "falling-squares"),
  ],
  "Design questions": [
    lc("Design HashMap", "easy", "design-hashmap"),
    lc("Design HashSet", "easy", "design-hashset"),
    lc("Design Browser History", "medium", "design-browser-history"),
    lc("Design Twitter", "medium", "design-twitter"),
    lc("Design Underground System", "medium", "design-underground-system"),
    lc("LFU Cache", "hard", "lfu-cache"),
  ],
  "Mock interview execution": [
    lc("Valid Number", "hard", "valid-number"),
    lc("Text Justification", "hard", "text-justification"),
    lc("Basic Calculator II", "medium", "basic-calculator-ii"),
    lc("Find Median from Data Stream", "hard", "find-median-from-data-stream"),
    hr("Interview Preparation Kit", "mixed", "interview-preparation-kit", true),
  ],
};

roadmap.forEach((stage) => {
  stage.topics.forEach((topicData) => {
    topicData.problems.push(...(masteryProblems[topicData.name] || []));
    topicData.videos = buildTopicVideos(stage.title, topicData.name);
  });
});

function topic(name, priority, detail, python, prompts, problems) {
  return { name, priority, detail, python, prompts, problems };
}

function prompt(text) {
  return text;
}

function lc(name, difficulty, slug, fullUrl = false) {
  return {
    name,
    difficulty,
    platform: "LeetCode",
    url: fullUrl ? slug : `https://leetcode.com/problems/${slug}/`,
  };
}

function gfg(name, difficulty, slug) {
  return {
    name,
    difficulty,
    platform: "GFG",
    url: `https://www.geeksforgeeks.org/${slug}/`,
  };
}

function hr(name, difficulty, slug, fullUrl = false) {
  return {
    name,
    difficulty,
    platform: "HackerRank",
    url: fullUrl ? `https://www.hackerrank.com/domains/${slug}` : `https://www.hackerrank.com/challenges/${slug}/problem`,
  };
}

function ytSearch(query) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

function buildTopicVideos(stageTitle, topicName) {
  const videos = [
    {
      title: "Python pattern video",
      url: ytSearch(`${topicName} data structures algorithms Python interview`),
    },
    {
      title: "NeetCode explanation",
      url: ytSearch(`NeetCode ${topicName}`),
    },
  ];

  if (stageTitle.includes("Graphs")) {
    videos.push({ title: "Graph deep dive", url: ytSearch(`William Fiset ${topicName} graph algorithm`) });
  }

  if (topicName.includes("dynamic") || topicName.includes("DP")) {
    videos.push({ title: "DP walkthrough", url: ytSearch(`dynamic programming ${topicName} Python interview`) });
  }

  if (topicName.includes("Binary search") || topicName.includes("sorting") || topicName.includes("Arrays")) {
    videos.push({ title: "Algorithm visual", url: ytSearch(`${topicName} visual explanation algorithm`) });
  }

  return videos;
}

const API_BASE = "";
const STORAGE_KEY = "dsa-interview-tracker-v2";
const LESSON_KEY = "dsa-level-game-progress-v1";
const AUTH_TOKEN_KEY = "dsa-auth-token";

function getToken() { return localStorage.getItem(AUTH_TOKEN_KEY); }
function setToken(t) { localStorage.setItem(AUTH_TOKEN_KEY, t); }
function clearToken() { localStorage.removeItem(AUTH_TOKEN_KEY); }

function authHeaders() {
  const token = getToken();
  return token ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` } : { "Content-Type": "application/json" };
}

async function apiGet(path) {
  try {
    const res = await fetch(`${API_BASE}${path}`, { headers: authHeaders() });
    if (!res.ok) throw new Error(`GET ${path} failed`);
    return await res.json();
  } catch {
    return null;
  }
}

async function apiPut(path, body) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`PUT ${path} failed`);
    return await res.json();
  } catch {
    return null;
  }
}

function showAuth() {
  document.querySelector("#authOverlay").classList.remove("auth-hidden");
  document.querySelector("#appMain").classList.remove("active");
}

function hideAuth() {
  document.querySelector("#authOverlay").classList.add("auth-hidden");
  document.querySelector("#appMain").classList.add("active");
}

async function loadUser(user) {
  document.querySelector("#greeting").textContent = user.email.split("@")[0];
  if (user.checked) {
    checked = new Set(user.checked);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user.checked));
  }
  if (user.lessonProgress) {
    lessonProgress.current = user.lessonProgress.current ?? lessonProgress.current;
    lessonProgress.completed = user.lessonProgress.completed ?? lessonProgress.completed;
    lessonProgress.codeDone = { ...lessonProgress.codeDone, ...(user.lessonProgress.codeDone || {}) };
    lessonProgress.practiceDone = { ...lessonProgress.practiceDone, ...(user.lessonProgress.practiceDone || {}) };
    lessonProgress.notes = { ...lessonProgress.notes, ...(user.lessonProgress.notes || {}) };
    localStorage.setItem(LESSON_KEY, JSON.stringify(lessonProgress));
  }
}

async function syncFromServer() {
  const data = await apiGet("/api/progress");
  if (data) await loadUser(data);
}

function syncToServer() {
  apiPut("/api/progress", {
    checked: [...checked],
    lessonProgress: {
      current: lessonProgress.current,
      completed: lessonProgress.completed,
      codeDone: lessonProgress.codeDone,
      practiceDone: lessonProgress.practiceDone,
      notes: lessonProgress.notes,
    },
  });
}

async function bootAuth() {
  const token = getToken();
  if (!token) { showAuth(); return; }
  const user = await apiGet("/api/auth/me");
  if (!user) { clearToken(); showAuth(); return; }
  await loadUser(user);
  hideAuth();
}

// ── Auth form handling ──

const authOverlay = document.querySelector("#authOverlay");
const loginForm = document.querySelector("#loginForm");
const signupForm = document.querySelector("#signupForm");
const authError = document.querySelector("#authError");

document.querySelector("#showSignup").addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.classList.add("hidden");
  signupForm.classList.remove("hidden");
  authError.textContent = "";
});

document.querySelector("#showLogin").addEventListener("click", (e) => {
  e.preventDefault();
  signupForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
  authError.textContent = "";
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = loginForm.querySelector(".auth-btn");
  btn.disabled = true;
  authError.textContent = "";
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: document.querySelector("#loginEmail").value,
        password: document.querySelector("#loginPassword").value,
      }),
    });
    const data = await res.json();
    if (!res.ok) { authError.textContent = data.error || "Login failed"; return; }
    setToken(data.token);
    await loadUser(data.user);
    hideAuth();
    renderAll();
  } catch {
    authError.textContent = "Could not connect to server";
  } finally {
    btn.disabled = false;
  }
});

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = signupForm.querySelector(".auth-btn");
  btn.disabled = true;
  authError.textContent = "";
  try {
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: document.querySelector("#signupEmail").value,
        password: document.querySelector("#signupPassword").value,
      }),
    });
    const data = await res.json();
    if (!res.ok) { authError.textContent = data.error || "Signup failed"; return; }
    setToken(data.token);
    await loadUser(data.user);
    hideAuth();
    renderAll();
  } catch {
    authError.textContent = "Could not connect to server";
  } finally {
    btn.disabled = false;
  }
});

document.querySelector("#logoutBtn").addEventListener("click", () => {
  clearToken();
  checked = new Set();
  lessonProgress = loadLessonProgress();
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LESSON_KEY);
  showAuth();
  loginForm.classList.remove("hidden");
  signupForm.classList.add("hidden");
  authError.textContent = "";
  document.querySelector("#loginEmail").value = "";
  document.querySelector("#loginPassword").value = "";
  document.querySelector("#signupEmail").value = "";
  document.querySelector("#signupPassword").value = "";
});

const roadmapEl = document.querySelector("#roadmap");
const resourceGrid = document.querySelector("#resourceGrid");
const algorithmGrid = document.querySelector("#algorithmGrid");
const labGrid = document.querySelector("#labGrid");
const levelList = document.querySelector("#levelList");
const lessonKicker = document.querySelector("#lessonKicker");
const lessonTitle = document.querySelector("#lessonTitle");
const lessonTheory = document.querySelector("#lessonTheory");
const lessonUse = document.querySelector("#lessonUse");
const lessonComplexity = document.querySelector("#lessonComplexity");
const lessonDeepNotes = document.querySelector("#lessonDeepNotes");
const lessonDryRun = document.querySelector("#lessonDryRun");
const lessonInterview = document.querySelector("#lessonInterview");
const lessonCode = document.querySelector("#lessonCode");
const explainList = document.querySelector("#explainList");
const lessonEquation = document.querySelector("#lessonEquation");
const lessonPractice = document.querySelector("#lessonPractice");
const practiceStatus = document.querySelector("#practiceStatus");
const lessonNotes = document.querySelector("#lessonNotes");
const xpPill = document.querySelector("#xpPill");
const prevLesson = document.querySelector("#prevLesson");
const nextLesson = document.querySelector("#nextLesson");
const markCode = document.querySelector("#markCode");
const stageTemplate = document.querySelector("#stageTemplate");
const topicTemplate = document.querySelector("#topicTemplate");
const searchInput = document.querySelector("#searchInput");
const resetButton = document.querySelector("#resetButton");
const filterButtons = [...document.querySelectorAll("[data-filter]")];

let activeFilter = "all";
let checked = loadChecked();
let lessonProgress = loadLessonProgress();

function loadChecked() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []);
  } catch {
    return new Set();
  }
}

function saveChecked() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...checked]));
  syncToServer();
}

function loadLessonProgress() {
  const defaultProgress = {
    current: 0,
    completed: [],
    codeDone: {},
    practiceDone: {},
    notes: {},
  };

  try {
    return { ...defaultProgress, ...(JSON.parse(localStorage.getItem(LESSON_KEY)) || {}) };
  } catch {
    return defaultProgress;
  }
}

function saveLessonProgress() {
  localStorage.setItem(LESSON_KEY, JSON.stringify(lessonProgress));
  syncToServer();
}

function itemId(type, stageIndex, topicIndex, name) {
  return `${type}-${stageIndex}-${topicIndex}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function renderResources() {
  resourceGrid.innerHTML = "";
  resources.forEach((resource) => {
    const link = document.createElement("a");
    link.href = resource.url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.className = "resource-link";
    link.innerHTML = `<span>${resource.kind}</span><strong>${resource.title}</strong>`;
    resourceGrid.appendChild(link);
  });
}

function renderAlgorithms() {
  algorithmGrid.innerHTML = "";
  [...algorithmGuide, ...sortingGuide].forEach((algorithm) => {
    const card = document.createElement("article");
    card.className = "algorithm-card";
    card.innerHTML = `
      <div class="algorithm-card-head">
        <h3>${algorithm.name}</h3>
        <span>${algorithm.time}</span>
      </div>
      <dl>
        <div><dt>Use when</dt><dd>${algorithm.useWhen}</dd></div>
        <div><dt>Why</dt><dd>${algorithm.why}</dd></div>
        <div><dt>Space</dt><dd>${algorithm.space}</dd></div>
        <div><dt>Questions</dt><dd>${algorithm.examples}</dd></div>
      </dl>
    `;
    algorithmGrid.appendChild(card);
  });
}

function renderLabs() {
  labGrid.innerHTML = "";
  numericalLabs.forEach((lab) => {
    const card = document.createElement("article");
    card.className = "lab-card";
    const steps = lab.steps.map((step) => `<li>${step}</li>`).join("");
    card.innerHTML = `
      <div class="lab-card-head">
        <h3>${lab.title}</h3>
        <span>${lab.pattern}</span>
      </div>
      <p class="lab-input">${lab.input}</p>
      <ol>${steps}</ol>
      <p class="lab-complexity">${lab.complexity}</p>
    `;
    labGrid.appendChild(card);
  });
}

function lessonId(index) {
  return `lesson-${index}`;
}

function practiceId(lessonIndex, problemIndex) {
  return `${lessonId(lessonIndex)}-practice-${problemIndex}`;
}

function isLessonComplete(index) {
  const id = lessonId(index);
  const lesson = lessons[index];
  const codeDone = lessonProgress.codeDone[id] === true;
  const practiceDone = lesson.practice.every((_, problemIndex) => {
    return lessonProgress.practiceDone[practiceId(index, problemIndex)] === true;
  });
  return codeDone && practiceDone;
}

function isLessonUnlocked(index) {
  if (index === 0) return true;
  return isLessonComplete(index - 1);
}

function renderLevelList() {
  levelList.innerHTML = "";
  lessons.forEach((lesson, index) => {
    const button = document.createElement("button");
    const complete = isLessonComplete(index);
    const unlocked = isLessonUnlocked(index);
    button.type = "button";
    button.className = "level-button";
    button.disabled = !unlocked;
    button.classList.toggle("active", index === lessonProgress.current);
    button.classList.toggle("complete", complete);
    button.innerHTML = `
      <span>${complete ? "✓" : unlocked ? index + 1 : "LOCK"}</span>
      <strong>${lesson.title}</strong>
    `;
    button.addEventListener("click", () => {
      if (!unlocked) return;
      lessonProgress.current = index;
      saveLessonProgress();
      renderLesson();
    });
    levelList.appendChild(button);
  });
}

function renderLesson() {
  if (!isLessonUnlocked(lessonProgress.current)) {
    lessonProgress.current = Math.max(0, lessonProgress.current - 1);
    saveLessonProgress();
  }

  const index = lessonProgress.current;
  const lesson = lessons[index];
  const id = lessonId(index);
  const done = isLessonComplete(index);
  const completedXp = lessons.reduce((sum, item, itemIndex) => {
    return isLessonComplete(itemIndex) ? sum + item.xp : sum;
  }, 0);

  lessonKicker.textContent = `${lesson.level} \u2022 ${lessons.length} levels`;
  lessonTitle.textContent = lesson.title;
  lessonTheory.textContent = lesson.theory;
  lessonUse.textContent = `Use: ${lesson.use}`;
  lessonComplexity.textContent = lesson.complexity;
  const codeWrapper = lessonCode.parentElement;
  if (!codeWrapper.classList.contains("code-block-wrapper")) {
    codeWrapper.classList.add("code-block-wrapper");
    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-btn";
    copyBtn.textContent = "Copy";
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(lesson.code).then(() => {
        copyBtn.textContent = "Copied!";
        setTimeout(() => { copyBtn.textContent = "Copy"; }, 1500);
      }).catch(() => {
        copyBtn.textContent = "Failed";
      });
    });
    codeWrapper.appendChild(copyBtn);
  }
  lessonCode.textContent = lesson.code;
  lessonEquation.textContent = lesson.equation;
  xpPill.textContent = `${completedXp} XP`;
  const detail = lessonEnhancements[lesson.title] || {
    deepNotes: [lesson.theory, `Use case: ${lesson.use}`, `Complexity: ${lesson.complexity}`],
    dryRun: [lesson.equation],
    interview: ["Explain the brute force idea first.", "State the optimized pattern.", "Dry run edge cases before finalizing."],
  };

  renderList(lessonDeepNotes, detail.deepNotes);
  renderList(lessonDryRun, detail.dryRun);
  renderList(lessonInterview, detail.interview);

  explainList.innerHTML = "";
  lesson.explanation.forEach((line) => {
    const item = document.createElement("li");
    item.textContent = line;
    explainList.appendChild(item);
  });

  lessonPractice.innerHTML = "";
  lesson.practice.forEach((problem, problemIndex) => {
    const checkId = practiceId(index, problemIndex);
    const label = document.createElement("label");
    label.className = "practice-check";
    label.classList.toggle("done", lessonProgress.practiceDone[checkId] === true);
    label.innerHTML = `
      <input type="checkbox" ${lessonProgress.practiceDone[checkId] ? "checked" : ""} />
      <span></span>
      <a href="${problem.url}" target="_blank" rel="noreferrer">
        <em>${problem.platform}</em>
        <strong>${problem.name}</strong>
        <small>${problem.difficulty}</small>
      </a>
    `;
    label.querySelector("input").addEventListener("change", (event) => {
      lessonProgress.practiceDone[checkId] = event.target.checked;
      saveLessonProgress();
      renderLesson();
    });
    lessonPractice.appendChild(label);
  });

  const solved = lesson.practice.filter((_, problemIndex) => lessonProgress.practiceDone[practiceId(index, problemIndex)]).length;
  practiceStatus.textContent = `${solved}/${lesson.practice.length} done`;
  lessonNotes.value = lessonProgress.notes[id] || "";
  markCode.textContent = lessonProgress.codeDone[id] ? "Code understood ✓" : "Mark code understood";
  markCode.classList.toggle("done", lessonProgress.codeDone[id] === true);
  prevLesson.disabled = index === 0;
  nextLesson.disabled = !done || index === lessons.length - 1;
  nextLesson.textContent = index === lessons.length - 1 ? "Final level" : done ? "Next level" : "Complete level first";

  renderLevelList();
  updateStats();
}

function renderList(element, items) {
  element.innerHTML = "";
  items.forEach((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    element.appendChild(item);
  });
}

function render() {
  roadmapEl.innerHTML = "";
  const query = searchInput.value.trim().toLowerCase();

  roadmap.forEach((stage, stageIndex) => {
    const stageNode = stageTemplate.content.firstElementChild.cloneNode(true);
    stageNode.querySelector(".stage-level").textContent = stage.level;
    stageNode.querySelector("h2").textContent = stage.title;

    const list = stageNode.querySelector(".topic-list");
    let visibleCount = 0;
    let stageDone = 0;

    stage.topics.forEach((topicData, topicIndex) => {
      const id = itemId("topic", stageIndex, topicIndex, topicData.name);
      const isDone = checked.has(id);
      const isImportant = topicData.priority === "important";
      const searchable = [
        topicData.name,
        topicData.detail,
        topicData.python,
        topicData.priority,
        ...topicData.prompts,
        ...topicData.problems.map((problem) => `${problem.name} ${problem.platform}`),
      ].join(" ").toLowerCase();
      const textMatch = searchable.includes(query);
      const filterMatch =
        activeFilter === "all" ||
        (activeFilter === "important" && isImportant) ||
        (activeFilter === "pending" && !isDone) ||
        (activeFilter === "done" && isDone);

      if (isDone) stageDone += 1;
      if (!textMatch || !filterMatch) return;

      const topicNode = topicTemplate.content.firstElementChild.cloneNode(true);
      const input = topicNode.querySelector("input");
      const badge = topicNode.querySelector(".badge");
      const videoList = topicNode.querySelector(".video-list");
      const problemList = topicNode.querySelector(".problem-list");

      input.checked = isDone;
      input.setAttribute("aria-label", `Mark ${topicData.name} as complete`);
      topicNode.querySelector("strong").textContent = topicData.name;
      topicNode.querySelector("small").textContent = topicData.detail;
      topicNode.querySelector(".python-focus").textContent = `Python: ${topicData.python}`;
      topicNode.querySelector(".interview-prompts").textContent = `Interview: ${topicData.prompts.join(" | ")}`;
      badge.textContent = topicData.priority === "important" ? "IMP" : topicData.priority.toUpperCase();
      badge.classList.add(topicData.priority);

      topicData.videos.forEach((video) => {
        const videoLink = document.createElement("a");
        videoLink.href = video.url;
        videoLink.target = "_blank";
        videoLink.rel = "noreferrer";
        videoLink.className = "video-link";
        videoLink.textContent = video.title;
        videoList.appendChild(videoLink);
      });

      topicData.problems.forEach((problem) => {
        const problemLink = document.createElement("a");
        problemLink.href = problem.url;
        problemLink.target = "_blank";
        problemLink.rel = "noreferrer";
        problemLink.className = "problem-link";
        problemLink.textContent = `${problem.platform}: ${problem.name} (${problem.difficulty})`;
        problemList.appendChild(problemLink);
      });

      input.addEventListener("change", () => {
        if (input.checked) checked.add(id);
        else checked.delete(id);
        saveChecked();
        render();
      });

      list.appendChild(topicNode);
      visibleCount += 1;
    });

    stageNode.querySelector(".stage-progress").textContent = `${stageDone}/${stage.topics.length}`;
    if (visibleCount === 0) stageNode.classList.add("hidden");
    roadmapEl.appendChild(stageNode);
  });

  if (roadmapEl.querySelectorAll(".topic").length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = '<span>&#128270;</span><p>No topics match your search. Try a different keyword.</p>';
    roadmapEl.appendChild(empty);
  }

  updateStats();
}

function updateStats() {
  const topics = roadmap.flatMap((stage) => stage.topics);
  const total = topics.length;
  const important = topics.filter((topicData) => topicData.priority === "important").length;
  const problems = topics.reduce((sum, topicData) => sum + topicData.problems.length, 0);
  const algorithms = algorithmGuide.length + sortingGuide.length;
  const lessonsDone = lessons.filter((_, index) => isLessonComplete(index)).length;
  const done = checked.size;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  const ring = document.querySelector("#progressRing");
  ring.dataset.value = `${percent}%`;
  const gradient = `conic-gradient(var(--accent) ${percent * 3.6}deg, rgba(255,255,255,0.08) 0deg)`;
  ring.style.background = gradient;
  const glow = ring.querySelector(".progress-ring-glow");
  if (glow) glow.style.background = gradient;
  document.querySelector("#progressTitle").textContent = `${done} of ${total} topics done`;
  document.querySelector("#progressSub").textContent = `${percent}% complete`;
  document.querySelector("#importantCount").textContent = important;
  document.querySelector("#pendingCount").textContent = total - done;
  document.querySelector("#streakCount").textContent = done;
  document.querySelector("#problemCount").textContent = problems;
  document.querySelector("#algorithmCount").textContent = algorithms;
  document.querySelector("#lessonCount").textContent = `${lessonsDone}/${lessons.length}`;
}

function renderAll() {
  renderResources();
  renderAlgorithms();
  renderLabs();
  renderLesson();
  render();
}

const controlsEl = document.querySelector(".controls");
const sentinel = document.querySelector(".sticky-sentinel");
const stickyObserver = new IntersectionObserver(
  ([entry]) => controlsEl.classList.toggle("stuck", !entry.isIntersecting),
  { threshold: [0] }
);
if (sentinel) stickyObserver.observe(sentinel);

searchInput.addEventListener("input", render);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    render();
  });
});

resetButton.addEventListener("click", () => {
  checked = new Set();
  saveChecked();
  render();
});

prevLesson.addEventListener("click", () => {
  lessonProgress.current = Math.max(0, lessonProgress.current - 1);
  saveLessonProgress();
  renderLesson();
});

nextLesson.addEventListener("click", () => {
  if (!isLessonComplete(lessonProgress.current)) return;
  lessonProgress.current = Math.min(lessons.length - 1, lessonProgress.current + 1);
  saveLessonProgress();
  renderLesson();
});

markCode.addEventListener("click", () => {
  const id = lessonId(lessonProgress.current);
  lessonProgress.codeDone[id] = !lessonProgress.codeDone[id];
  saveLessonProgress();
  renderLesson();
});

lessonNotes.addEventListener("input", () => {
  lessonProgress.notes[lessonId(lessonProgress.current)] = lessonNotes.value;
  saveLessonProgress();
});

(async function boot() {
  await bootAuth();
  if (getToken()) {
    await syncFromServer();
    renderAll();
  }
})();
