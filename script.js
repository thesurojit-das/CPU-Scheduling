var sol = true;
var AT = Array();
var BT = Array();
var Priority = Array();


const Algorithm = document.getElementById('Algorithm');
Algorithm.addEventListener('change', function handleChange(event) {
  if (event.target.value == '4') {
    time.style.display = 'block';
  } else {
    time.style.display = 'none';
  }
});

Algorithm.addEventListener('change', function handleChange(event) {
  if (event.target.value == '5') {
    priority.style.display = 'block';
    if (AT.length != BT.length!=Priority.length) {
      alert("Invalid input");
    }
  } else {
    priority.style.display = 'none';
  }
});

function solve() {
  if (sol) {
    var at = document.getElementById('AT').value;
    var bt = document.getElementById('BT').value;
    var quantum = document.getElementById('tq').value;
    var pp=document.getElementById('pr').value;
    AT = at.split(',').map(x => +x);
    BT = bt.split(',').map(x => +x);
    Priority=pp.split(',').map(x =>+x);
    var process = AT.length;
    var TAT = new Array(process).fill(0);
    var WT = new Array(process).fill(0);
    var CT = new Array(process).fill(0);
    if (AT.length != BT.length) {
      alert("Invalid input");
    }
    else {
      var choice = parseInt(Algorithm.value);
      switch (choice) {
        case 1: sjfCal(process, AT, BT, CT, TAT, WT);
          break;
        case 2: srtfCal(process, AT, BT, CT, TAT, WT);
          break;
        case 3: fCal(process, AT, BT, CT, TAT, WT);
          break;
        case 4: rCal(process, AT, BT, CT, TAT, WT, quantum);
          break;
        case 5: pnpCal(process, AT, BT, CT, TAT, WT, Priority);
          break;
        // case 6: ppCal(process, AT, BT, CT, TAT, WT, quantum);
      }
    }
    sol = false;
  }
}
function Reset() {
  document.getElementById('AT').value = "";
  document.getElementById('BT').value = "";
  document.getElementById('tq').value = "";
  document.getElementById('sd').innerHTML = "";
  document.getElementById('result').innerHTML = "";
  document.getElementById('result1').innerHTML = "";
}


// FCFS FUNCTION START
function fCal(process, AT, BT, CT, TAT, WT) {
  function findWaitingTime(process, n, BT, WT, AT) {
    var service_time = Array.from({ length: n }, (_, i) => 0);
    service_time[0] = AT[0];
    WT[0] = 0;
    for (var i = 1; i < n; i++) {
      var wasted = 0;
      service_time[i] = service_time[i - 1] + BT[i - 1];
      WT[i] = service_time[i] - AT[i];
      if (WT[i] < 0) {
        wasted = MATh.abs(WT[i]);
        WT[i] = 0;
      }
      service_time[i] = service_time[i] + wasted;
    }
  }
  function findTurnAroundTime(process, n, BT, WT, TAT) {
    for (var i = 0; i < n; i++)
      TAT[i] = BT[i] + WT[i];
  }
  function findavgTime(process, n, BT, AT) {
    findWaitingTime(process, n, BT, WT, AT);
    findTurnAroundTime(process, n, BT, WT, TAT);
    var totalWT = 0, totalTAT = 0;
    for (var i = 0; i < n; i++) {
      totalWT = totalWT + WT[i];
      totalTAT = totalTAT + TAT[i];
      CT[i] = TAT[i] + AT[i];
    }
    totalTAT = totalTAT / n;
    totalWT = totalWT / n;
    var process = n;
    insertval(process, AT, BT, TAT, CT, WT, totalTAT, totalWT)
  }
  var process = []
  for (var i = 1, j = 0; i <= AT.length; i++, j++) {
    process[j] = i;
  }
  console.log("Process " + process);
  var n = process.length;
  for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 5 - i; j++) {
      if (AT[j] > AT[j + 1]) {
        [AT[j], AT[j + 1]] = [AT[j + 1], AT[j]];
        [BT[j], BT[j + 1]] = [BT[j + 1], BT[j]];
      }
    }
  }
  findavgTime(process, n, BT, AT);
}
// END FCFS FUNCTION



// RR Function 
function rCal(process, AT, BT, CT, TAT, WT, quantum) {
  for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 5 - i; j++) {
      if (AT[j] > AT[j + 1]) {
        [AT[j], AT[j + 1]] = [AT[j + 1], AT[j]];
        [BT[j], BT[j + 1]] = [BT[j + 1], BT[j]];
      }
    }
  }
  const queueUpdation = (queue, timer, AT, n, maxProccessIndex) => {
    console.log("queueUpdation");
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
    console.log("queueMaintainence");
    for (let i = 0; (i < n - 1) && (queue[i + 1] != 0); i++) {
      let temp = queue[i];
      queue[i] = queue[i + 1];
      queue[i + 1] = temp;
    }
  }
  const checkNewArrival = (timer, AT, n, maxProccessIndex, queue) => {
    console.log("checkNewArrival");
    if (timer <= AT[n - 1]) {
      let newArrival = false;
      for (let j = (maxProccessIndex + 1); j < n; j++) {
        if (AT[j] <= timer) {
          if (maxProccessIndex < j) {
            maxProccessIndex = j;
            newArrival = true;
          }
        }
      }
      if (newArrival)
        queueUpdation(queue, timer, AT, n, maxProccessIndex);
    }
  }
  let n = process;
  let tq = quantum;
  let timer = 0;
  let maxProccessIndex = 0;
  let avgWait = 0;
  let avgTT = 0;
  const queue = [];
  const temp_burst = [];
  for (let i = 0; i < n; i++) {
    temp_burst[i] = BT[i];
  }
  for (let i = 0; i < n; i++) {
    CT[i] = false;
    queue[i] = 0;
  }
  while (timer < AT[0])
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
        checkNewArrival(timer, AT, n, maxProccessIndex, queue);
      }
      if ((temp_burst[queue[0] - 1] == 0) && (CT[queue[0] - 1] == false)) {
        TAT[queue[0] - 1] = timer;
        CT[queue[0] - 1] = true;
      }
      let idle = true;
      if (queue[n - 1] == 0) {
        for (let i = 0; i < n && queue[i] != 0; i++) {
          if (CT[queue[i] - 1] == false) {
            idle = false;
          }
        }
      }
      else
        idle = false;
      if (idle) {
        timer++;
        checkNewArrival(timer, AT, n, maxProccessIndex, queue);
      }
      queueMaintainence(queue, n);
    }
  }
  for (let i = 0; i < n; i++) {
    CT[i] = TAT[i] - AT[i];
    WT[i] = CT[i] - BT[i];
  }
  for (let i = 0; i < n; i++) {
    avgWait += WT[i];
    avgTT += CT[i];
  }
  avgWait = avgWait / n;
  var totalWT = avgWait;
  avgTT = avgTT / n;
  var totalTAT = avgTT;
  var temp = []
  temp = TAT;
  TAT = CT;
  CT = temp;
  insertval(process, AT, BT, TAT, CT, WT, totalTAT, totalWT);
}
// RR FUNCTION END


// SRTF  START FUNCTION
function srtfCal(process, AT, BT, CT, TAT, WT) {
  var process = [];
  for (var i = 0; i < AT.length; i++) {
    process[i] = i;
  }
  var n = AT.length;
  var totalTAT = 0, totalWT = 0
  sortAT(AT, BT, process, n);
  sortBT(AT, BT, process, n);
  sjf(AT, BT, process, WT, TAT, CT, totalTAT, totalWT, n);
  function sortAT(AT, BT, process, n) {
    // console.log("AT");
    for (var i = 0; i < n; i++) {
      for (var j = 0; j < n - i; j++) {
        if (AT[j] > AT[j + 1]) {
          [process[j], process[j + 1]] = [process[j + 1], process[j]];
          [AT[j], AT[j + 1]] = [AT[j + 1], AT[j]];
          [BT[j], BT[j + 1]] = [BT[j + 1], BT[j]];
        }
      }
    }
  }
  function sortBT(AT, BT, process, n) {
    // console.log("BT");
    for (var i = 0; i < n; i++) {
      for (var j = i + 1; j < n; j++) {
        if (AT[i] == AT[j]) {
          if (BT[j] > BT[j + 1]) {
            [process[j], process[j + 1]] = [process[j + 1], process[j]];
            [AT[j], AT[j + 1]] = [AT[j + 1], AT[j]];
            [BT[j], BT[j + 1]] = [BT[j + 1], BT[j]];
          }
        }
      }
    }
  }
  function sjf(AT, BT, process, WT, TAT, CT, totalTAT, totalWT, n) {
    var temp, value;
    CT[0] = AT[0] + BT[0];
    TAT[0] = CT[0] - AT[0];
    WT[0] = TAT[0] - BT[0];
    for (var i = 1; i < n; i++) {
      temp = CT[i - 1];
      var low = BT[i];
      for (var j = i; j < n; j++) {
        if (temp >= AT[j] && low >= BT[j]) {
          low = BT[j];
          value = j;
        }
      }
      CT[value] = temp + BT[value];
      TAT[value] = CT[value] - AT[value];
      WT[value] = TAT[value] - BT[value];
    }
    for (var i = 0; i < n; i++) {
      totalTAT += TAT[i];
      totalWT += WT[i];
    }
    totalTAT = totalTAT / n;
    totalWT = totalWT / n;
    var process = AT.length;
    insertval(process, AT, BT, CT, TAT, WT, totalTAT, totalWT);
  }
}
// SRTF FUNCTION END 


// SJF START Function
function sjfCal(process, AT, BT, CT, TAT, WT) {
var n=AT.length;
var process=[];
for(var i=0;i<n;i++){
process[i]=i+1;
}
var f=Array(n).fill(0)
var totalTAT=0, totalWT=0;
var st=0,tot=0;
while(true){
  var c=n,min=999999;
  if(tot==n)
  break;
  for(var i=0;i<n;i++){
      if((AT[i]<=st)&&(f[i]==0)&&(BT[i]<min)){
          min=BT[i];
          c=i;
      }
  }
  if(c==n){
      st++;
  }
  else{
            CT[c]=st+BT[c];
              st+=BT[c];
              TAT[c]=CT[c]-AT[c];
              WT[c]=TAT[c]-BT[c];
              f[c]=1;
              process[tot] = c + 1;
              tot++;
  }
}
for(var i=0;i<n;i++){
  totalTAT+=TAT[i];
  totalWT+=WT[i];
}
totalWT/=n
totalTAT/=n;
process=n;
insertval(process, AT, BT, CT, TAT, WT, totalTAT, totalWT)
}
// SJF FUNCTION ENDS



// INSERT VAL TO TABLE
function insertval(process, At, BT, CT, TAT, WT, totalTAT, totalWT) {
  // output.style.display="block "
  var job = Array(process)
  console.log("WT " + WT);
  console.log("BT " + BT);
  console.log("AT " + AT);
  console.log("TAT " + TAT);
  console.log("CT " + CT);
  for (var i = 0; i < process; i++) {
    if (TAT[i] <= 0) {
      TAT[i] = 0;
    }
  }
  for (var i = 0; i < process; i++) {
    if (CT[i] <= 0) {
      CT[i] = 0;
    }
  }
  for (var i = 0; i < process; i++) {
    if (WT[i] <= 0) {
      WT[i] = 0;
    }
  }

  console.log("WT " + WT);
  console.log("BT " + BT);
  console.log("AT " + AT);
  console.log("TAT " + TAT);
  console.log("CT " + CT);

  for (var i = 1, j = 0; i <= process; i++, j++) {
    job[j] = i;
  }
  var table = document.createElement('table');
  var tr = document.createElement('tr');
  var arrheader = ['Job', 'Arrival Time', 'Burst Time', 'Finish Time', 'Turn Around Time', 'Waiting Time'];
  var array = []
  for (var i = 0; i < process; i++) {
    array.push({
      Job: job[i],
      ArrivalTime: AT[i],
      BurstTime: BT[i],
      FinishTime: CT[i],
      TurnAroundTime: TAT[i],
      WaitingTime: WT[i]
    })
  }
  for (var j = 0; j < 6; j++) {
    var th = document.createElement('th'); //column
    var text = document.createTextNode(arrheader[j]); //cell

    th.appendChild(text);
    tr.appendChild(th);
  }
  table.appendChild(tr);

  for (var i = 0; i < process; i++) {
    var tr = document.createElement('tr');

    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    var td5 = document.createElement('td');
    var td5 = document.createElement('td');
    var td6 = document.createElement('td');

    var text1 = document.createTextNode(array[i].Job);
    var text2 = document.createTextNode(array[i].ArrivalTime);
    var text3 = document.createTextNode(array[i].BurstTime);
    var text4 = document.createTextNode(array[i].FinishTime);
    var text5 = document.createTextNode(array[i].TurnAroundTime);
    var text6 = document.createTextNode(array[i].WaitingTime);

    td1.appendChild(text1);
    td2.appendChild(text2);
    td3.appendChild(text3);
    td4.appendChild(text4);
    td5.appendChild(text5);
    td6.appendChild(text6);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);

    table.appendChild(tr);
  }
  var Table = document.getElementById('show');
  var AddTable = table;
  Table.appendChild(AddTable);
  document.getElementById('result').innerHTML = "Average TurnAroundTime " + totalTAT
  document.getElementById('result1').innerHTML = "Average WaitingTime " + totalWT;
}


// PRIORITY PREEMPTIVE
// PRIORITY NON-PREEMPTIVE
// UNDER PROGRESS 
// function pnpCal(process, AT, BT, CT, TAT, WT, pr) {
//   var temp = []
//   var n = AT.length;
//   console.log(n);
//   var totalTAT = 0, totalWT = 0
//   var b = 0, k = 1;
//   for (var i = 0; i < n; i++) {
//     for (var j = 0; j < n; j++) {
//       if (AT[i] < AT[j]) {
//         [AT[i], AT[j]] = [AT[j], AT[i]];
//         [BT[i], BT[j]] = [BT[j], BT[i]];
//       }
//     }
//   }
//   for (var j = 0; j < n; j++) {
//     b = b + BT[j];
//     min = BT[k];
//     for (var i = k; i < n; i++) {
//       min = pr[k];
//       if (b >= AT[i]) {
//         if (pr[i] < min) {
//           [AT[k], AT[i]] = [AT[i], AT[k]];
//           [BT[k], BT[i]] = [BT[i], BT[k]];
//           [pr[k], pr[i]] = [pr[i], pr[k]];
//         }
//       }
//     }
//     k++;
//   }
//   temp[0] = 0;
//   for (var i = 0; i < n; i++) {

//     WT[i] = 0;
//     TAT[i] = 0;
//     temp[i + 1] = temp[i] + BT[i];
//     WT[i] = temp[i] - AT[i];
//     TAT[i] = WT[i] + BT[i];
//     totalTAT = totalTAT + TAT[i];
//     totalWT = totalWT + WT[i];
//   }
//   for (var i = 0; i < n; i++) {
//     CT[i] = AT[i] + TAT[i];
//   }

//   totalTAT = totalTAT / n;
//   totalWT = totalWT / n;
//   insertval(process, AT, BT, CT, TAT, WT, totalTAT, totalWT);
// }

// END 