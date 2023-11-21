function condense(vals, len) {
  for (let i = 0; i < len - 1; i++) {
    if (vals[i] >= 3) {
      let amount = ~~(vals[i] / 3)
      vals[i] -= amount * 3
      vals[i + 1] += amount
    }
  }
}

function calc_weap() {
  const ids = ["gr-o-weap", "b-o-weap", "p-o-weap", "go-o-weap", 
               "gr-r-weap", "b-r-weap", "p-r-weap", "go-r-weap",
               "gr-lo-weap", "b-lo-weap", "p-lo-weap", "go-lo-weap"]
  const avgs = [2.2, 2.4, 0.64, 0.07]
  let vals = []
  

  for(let i = 0; i < 8; i++) {
    let value = document.getElementById(ids[i]).value;
    vals[i] = /^\d+$/.test(value) ? parseInt(value) : 0
  }

  for(let i = 0; i < 4; i++) {
    vals[i] -= vals[i + 4]
  }

  condense(vals, 4)

  vals = vals.slice(0, 4)

  let runs = 0

  for(let i = 0; i < 4; i++) {
    if (vals[i] < 0) {
      for(let i = 0; i < 4; i++) {
        vals[i] += avgs[i]
      }
      condense(vals, 4)
      runs++;
      i--;
    }
  }

  for(let i = 0; i < 4; i++) {
    vals[i] = Math.floor(vals[i])
    document.getElementById(ids[i + 8]).value = vals[i]
  }

  document.getElementById("weap-runs").innerHTML = `in ${runs} runs`
}

function calc_tal() {
  const ids = ["g-o-tal", "b-o-tal", "p-o-tal",  
               "g-r-tal", "b-r-tal", "p-r-tal",
               "g-lo-tal", "b-lo-tal", "p-lo-tal"]
  const avgs = [2.2, 1.97, 0.23]
  let vals = []
  

  for(let i = 0; i < 6; i++) {
    let value = document.getElementById(ids[i]).value;
    vals[i] = /^\d+$/.test(value) ? parseInt(value) : 0
  }

  for(let i = 0; i < 3; i++) {
    vals[i] -= vals[i + 3]
  }

  condense(vals, 3)

  vals = vals.slice(0, 3)

  let runs = 0

  for(let i = 0; i < 3; i++) {
    if (vals[i] < 0) {
      for(let i = 0; i < 3; i++) {
        vals[i] += avgs[i]
      }
      condense(vals, 3)
      runs++;
      i--;
    }
  }

  for(let i = 0; i < 3; i++) {
    vals[i] = Math.floor(vals[i])
    document.getElementById(ids[i + 6]).value = vals[i]
  }

  document.getElementById("tal-runs").innerHTML = `in ${runs} runs`
}