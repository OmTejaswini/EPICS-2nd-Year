module.exports = class Graph {
    constructor(v) {
      this.v = v;
      this.adj = new Array(v);
      for (let i = 0; i < v; i++) {
        // this.adj.push([])
        this.adj[i] = [];
      }
    }
    addEdge(v, w) {
        this.adj[v].push(w);
        this.adj[w].push(v);
    }
    coloring(m,arr,obj) {
      // document.write("wdsef")
        let n = m;
        let res = new Array(n);
        
        for (let i = 0; i < n; i++) {
            res[i] = [];
        }
      // document.write("wdsef")
        const slots = ['09:00:00','10:00:00','11:00:00','12:00:00','13:00:00','14:00:00','15:00:00','16:00:00','17:00:00'];
        // res[0] = 0;
        let avail = new Array(n);
        
        for (let i = 0; i < n; i++) {
            avail[i] = true;
        }
      // document.write("wdsef")
        for(let j = 0 ; j < n-1 ; j++){
          console.log("Hello1")
            var st = arr[j].StartTime;
            console.log("Hello2")
          // document.write(st)
            var et = arr[j].EndTime;
            console.log("Hello3")
          // document.write(et)
            let s;
            let e;
            for(let i = 0 ; i < slots.length ; i++){
              // document.write(slots[i])
              // document.write(st)
              console.log("hi" + st.localeCompare(slots[i]))
                if(!(st.localeCompare(slots[i]))){
                    s = i;
                }
                if(!(et.localeCompare(slots[i]))){
                    e = i;
                }
            }
          // document.write(s)
          // document.write(e)
            for(let k = s; k < e ; k++){
                res[j].push(k)
              // document.write(res[j])
                avail[k] = false;
            }
      }
      const slots1 = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'];
      // document.write("wdsef")
       // document.write(s)
      let h = 0;
      let s,e;
      for(let i = 0 ; i < slots1.length ; i++){
        console.log(obj.EndTime)
        console.log(slots1[i] + " slots")
        console.log((obj.StartTime).localeCompare(slots1[i]))
        if(!((obj.StartTime).localeCompare(slots1[i]))){
          s = i;
           // document.write(s)
           console.log(s+" s")
        }
        if(!((obj.EndTime).localeCompare(slots1[i]))){
          e = i;
          console.log(e+" e")
        }
      }
      // document.write(s)
      // document.write(e)
      h = e-s;
      // document.write(h)
      console.log(h+" h")
        let cr = 0;
        while (cr < slots.length-h) {
          // document.write(cr+"<br>")
          let hr = 0;
          // document.write(hr+" hr <br>")
          for (let index = cr; index < cr+h; index++) {
            // document.write(index +" index <br>")
            // document.write(avail[index]+" avail <br>")
            if(avail[index] == true){
              hr++;
            }
            // else{
            //   hr = 0
            // }
            
          }
          if(hr == h){
              break;
          }
          
          cr++;
          // document.write(cr+"<br>")
        }
      //   document.write(cr+"<br>")
      // document.write(cr+h +"<br>")
      // document.write(n + "")
        if(cr+h < slots.length){
          // document.write("hiii")
          for(let i = cr ; i < cr+h ; i++){
            // document.write("hiii")
            res[n-1].push(i);
            console.log("res "+ res[n-1] + "<br>")
          }
        }
      for(let i = 0 ; i < n-1 ; i++){
        console.log(arr[i]+"<br>")
        console.log(arr[i].BookingID + " color is " + res[i] + "<br>")
      }
      console.log(obj.BookingID + " color is " + res[n-1] + "<br>")
      return res[n-1];
    }
  
  }
  
  //   // Driver code
  // let g1 = new Graph(5);
  // let arr = [
  // {
  //   BookingID: 1,
  //   RName: 'SRK222',
  //   BookingDate: 2023-03-29,
  //   StartTime: '09:00:00',
  //   EndTime: '10:00:00'
  // },
  // {
  //   BookingID: 2,
  //   RName: 'SRK222',
  //   BookingDate: 2023-03-29,
  //   StartTime: '01:00:00',
  //   EndTime: '03:00:00',
  // }
  // ]
  
  // let obj = {
  //   BookingID: 3,
  //   RName: 'SRK222',
  //   BookingDate: 2023-03-29,
  //   StartTime: '09:00:00',
  //   EndTime: '11:00:00',
  // }
  // // document.write("wdsef")
  // let x = g1.coloring(3,arr,obj)
  // const slots = ['09:00:00','10:00:00','11:00:00','12:00:00','01:00:00','02:00:00','03:00:00','04:00:00','05:00:00'];
  // // console.log(x)
  // // console.log(typeof(x))
  // for(let i = 0 ; i < x.length ; i++){
  //   console.log(slots[x[i]])
  // }
  
  //   document.write("Coloring of nnnngraph 1<br>");
  //   g1.addEdge(0, 1);
  //   g1.addEdge(0, 2);
  //   g1.addEdge(1, 2);
  //   g1.addEdge(1, 3);
  
  
  