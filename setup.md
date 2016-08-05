# Randomness Practical: Setup
In time this will be on the virtual machine. For now there's just a few things to do before you start.

## Python Package Installation
```
cd Tyche
easy_install .
```

**We use Python 3 for this.** If your system defaults to Python 2, you might need to run `easy_install3 .` or `easy_install-3.5 .` or something like that.

```
cd ../randompy
easy_install .
```

This should have installed all the packages you need.

## Run the servers
```
./run.sh
```

Leave this running in the background. `CTRL+C` will kill it and all the child processes when you're done.
