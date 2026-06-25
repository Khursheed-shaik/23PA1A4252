const priorityRank = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function getPriorityValue(notification) {
  return priorityRank[notification.type || notification.category || notification.priority] ?? 0;
}

function normalizeTimestamp(value) {
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function compareNotifications(a, b) {
  const priorityA = getPriorityValue(a);
  const priorityB = getPriorityValue(b);

  if (priorityA !== priorityB) {
    return priorityA - priorityB;
  }

  return normalizeTimestamp(a.createdAt) - normalizeTimestamp(b.createdAt);
}

class MinHeap {
  constructor(compare) {
    this.compare = compare;
    this.nodes = [];
  }

  get size() {
    return this.nodes.length;
  }

  peek() {
    return this.nodes[0];
  }

  push(value) {
    this.nodes.push(value);
    this.bubbleUp(this.nodes.length - 1);
  }

  pop() {
    if (this.nodes.length === 0) {
      return undefined;
    }
    const top = this.nodes[0];
    const last = this.nodes.pop();
    if (this.nodes.length > 0) {
      this.nodes[0] = last;
      this.bubbleDown(0);
    }
    return top;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.compare(this.nodes[index], this.nodes[parentIndex]) >= 0) {
        break;
      }
      [this.nodes[parentIndex], this.nodes[index]] = [this.nodes[index], this.nodes[parentIndex]];
      index = parentIndex;
    }
  }

  bubbleDown(index) {
    const length = this.nodes.length;
    while (true) {
      let smallest = index;
      const left = index * 2 + 1;
      const right = index * 2 + 2;

      if (left < length && this.compare(this.nodes[left], this.nodes[smallest]) < 0) {
        smallest = left;
      }
      if (right < length && this.compare(this.nodes[right], this.nodes[smallest]) < 0) {
        smallest = right;
      }
      if (smallest === index) {
        break;
      }
      [this.nodes[index], this.nodes[smallest]] = [this.nodes[smallest], this.nodes[index]];
      index = smallest;
    }
  }
}

export function getTopUnreadNotifications(notifications, count = 10) {
  const limit = Math.max(1, Number(count) || 10);
  const heap = new MinHeap(compareNotifications);

  for (const notification of notifications) {
    const viewed = notification.viewed || notification.read || false;
    if (viewed) {
      continue;
    }

    if (heap.size < limit) {
      heap.push(notification);
      continue;
    }

    if (compareNotifications(notification, heap.peek()) > 0) {
      heap.pop();
      heap.push(notification);
    }
  }

  const result = [];
  while (heap.size) {
    result.push(heap.pop());
  }

  return result.sort((a, b) => compareNotifications(b, a));
}

export function sortNotifications(notifications) {
  return [...notifications].sort((a, b) => compareNotifications(b, a));
}
