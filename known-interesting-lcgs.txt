# cargo run 120 121 1
cargo run 121 120 1
# cargo run 25214903917 281474976710656 11
cargo run 259 65534 0
cargo run 29305 58564 1
cargo run 361 450 1
cargo run 57 65536 1
cargo run 61 180 1
cargo run 65473 65536 0
cargo run 71 125 1
cargo run 9562 65522 0
cargo run 85 65536 1 # maximal. but LOB cycle lengths are 2**low_order_bit_count.
cargo run 1001 2187 8 # nonmaximal, cycle_length=162. but LOB cycle lengths are all 162.
