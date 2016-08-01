package main

import (
  "fmt"
  "github.com/46bit/pnc"
)

func main() {
  l := pnc.NewLCG()
  l.Seed(0)

  for i := 0; i < 65536; i++ {
    fmt.Printf("%d\n", l.Urand32())
  }
}
