class Graph {
    constructor(v) {
      this.v = v;
      this.adj = new Array(v);
      for (let i = 0; i < v; i++) {
        // this.adj.push([])
        this.adj[i] = [];
      }
    }
    // addEdge(x, y) {
    //   document.write("qqqqqqqqq<br>");
    //   this.adj[x].push(y);
    //   document.write("qqqqqqqqq<br>");
    //   this.adj[y].push(x);
    //   document.write("qqqqqqqqq<br>");
    // }
      addEdge(v, w) {
      this.adj[v].push(w);
      this.adj[w].push(v);
      }
    coloring() {
      let n = this.v;
      let res = new Array(n);
      for (let i = 0; i < n; i++) {
        res[i] = -1;
      }
      res[0] = 0;
      let avail = new Array(n);
      for (let i = 0; i < n; i++) {
        avail[i] = true;
      }
      for (let j = 1; j < n; j++) {
        for (let x of this.adj[j]) {
          if (res[x] != -1) {
            avail[res[x]] = false;
          }
        }
        let cr = 0;
        while (cr < n) {
          if (avail[cr] == true) {
            break;
          }
          cr++
        }
        res[j] = cr;
        for (let i = 0; i < n; i++) {
          avail[i] = true;
        }
      }
      for(let u = 0; u < this.v; u++)
            document.write("Vertex " + u + " ---> Color"+ res[u] + "<br>");
    }
    
    
  }
  
  // Driver code
  let g1 = new Graph(5);
  document.write("Coloring of nnnngraph 1<br>");
  g1.addEdge(0, 1);
  g1.addEdge(0, 2);
  g1.addEdge(1, 2);
  g1.addEdge(1, 3);
  g1.addEdge(2, 3);
  g1.addEdge(3, 4);
  document.write("Coloring of graph 1<br>");
  g1.coloring();
  
  document.write("<br>");
  let g2 = new Graph(5);
  g2.addEdge(0, 1);
  g2.addEdge(0, 2);
  g2.addEdge(1, 2);
  g2.addEdge(1, 4);
  g2.addEdge(2, 4);
  g2.addEdge(4, 3);
  document.write("Coloring of graph 2<br> ");
  g2.coloring();
  
  // This code is contributed by avanitrachhadiya2155
  
  