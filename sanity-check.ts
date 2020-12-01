const main = async (): Promise<any> => {
  let f = '0x123'
  let strFirstTwo = f.substring(0,2);
  // console.log(strFirstTwo)

  // console.log(str); //shows '012123'
  // console.log(strFirstThree); // shows '012'
  if(strFirstTwo === '0x') {
    console.log('f split')
  }

  let g = '321'
  strFirstTwo = g.substring(0,2);
  // console.log(strFirstTwo)
  if(strFirstTwo === '0x') {
    console.log('g split')
  }
  // console.log(g.split('x'))
  // if(g.split('x')) {
  //   console.log('g split')
  // }

  // const memoStr: string = "Sanity Check"
  // console.log(memoStr)
  // console.log("------")
  // let words: string[] = ["all", "the", "things"]
  // words.forEach((word: string , index: number) => {
  //   console.log(word)
  //   console.log(index)
  //   console.log("------")
  // })
}
  
main()
