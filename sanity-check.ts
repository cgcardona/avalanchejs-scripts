const main = async (): Promise<any> => {
  const memoStr: string = "Sanity Check"
  console.log(memoStr)
  console.log("------")
  let words: string[] = ["all", "the", "things"]
  words.forEach((word: string , index: number) => {
    console.log(word)
    console.log(index)
    console.log("------")
  })
}
  
main()
