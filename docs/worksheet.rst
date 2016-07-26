
.. _ref_worksheet:

=========
Worksheet
=========

Preparation
___________

Start the Virtual Machine and use a browser to login as *student* to the web shell
(port 12320) and Usermin (port 12323). Your instructor will provide the password.
(See Virtual Machine documentation if you have not done this before.)

The folder ``/home/student/dev/`` includes a Python script ``pwtest.py`` which
can be used to test that you have access to the pwcheck function::

    student@lamp ~/dev$ python3 pwtest.py
    Please type name and password, or ? for help
    Name: howard
    Password: wrongpw
    ERROR incorrect user name or password
    Try again? (type N for exit)

Note that the script is executed using ``python3`` (not *python*). Howard's password
is given as a comment in the program to allow you to test a passwod that is correct::

    Please type name and password, or ? for help
    Name: howard
    Password: 3IWLNJAlNaD
    You have successfully logged in

Look at how the script tests the password::

    from cp_extlib import pwcheck

    ...
    if pwcheck(name, pw):
        print('You have successfully logged in')

All that is needed is to import ``pwcheck`` and call it with name and password strings.

The password policy for this system is:

* Names must be at least 4 characters and must not be a single repeated character.
* Passwords must be between 8 and 16 characters long.
* Passwords must contain at least one lowercase letter, uppercase letter, and number.

A password which fails this policy will not be tested; this will be important when you
are writing your exploit, any valid test must meet these rules.

Timing Function Calls
_____________________

Write a small program or modify the existing test program to time how long it takes
to test a password. Note the following Python::

    from timeit import default_timer as timer

    ...
    start   = timer()
    result  = pwcheck(NAME, pw_tst)
    elapsed = timer() - start

The reason for this suggestion is that the use of the default_timer from timeit will
provide the best timer for the operating system on which you are working. (time(),
clock() behave differently depending on operating system.)

**Now build a reliable timer for the pwcheck() function.**

Hint:
    Try a few successful tests and a few passwords that fail in the first character. Does your
    code show a clear timing distinction?

    If not (very likely) you may be confused by garbage collection or system scheduling, will several
    samples resolve this problem?


Exploiting a Lottery CSPRNG
___________________________

The folder ``/home/student/dev/prng/`` includes a Python script ``hex-lottery``::

    ############################################
    ***       THE HEXADECIMAL LOTTERY        ***
    ***     Reward doubles every minute!     ***
    ############################################

    *** This is MINUTE 5
        It's $32 a play
        For a $32768 jackpot!

    :: Which 8 symbols do you want to pick? [ffffffff]

            7 6 5 4 3 2 1 0
    TO WIN  f f f f f f f f
    DRAWN   0 5 0 2 5 b a 3

    :: You didn't win! :-(

The lottery asks you for your choice of lottery ticket and then randomly draws 8 hexadecimal numbers.
If your choice matches the randomly picked numbers, you win! However you've been thinking about this,
and each hexadecimal character corresponds to a 4-bit value. With 8 hex characters, that's a 32-bit
value. So the odds of winning are 1-in-4,294,967,295. This means that the lottery will average a winner about every 2.1 billion plays. As you can tell, this lottery is going to make a lot of profit.

You've heard a rumour the lottery is running on an cheap microcontroller, so that the software system
is small enough to be auditable. However this little Embedded System doesn't have any facilities for
obtaining entropy, and it's quite possible they're just seeding their PRNG with the current time when
they power it on.

The competition reward doubles every minute it is turned on. Being a dastardly hacker, you've twigged
that this can tell you the time it was switched on - and thus their PRNG seed! Then maybe you can run it
forward and predict the lottery draw before it happens!

Write a script to get the current minute
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
As mentioned, the script starts by outputting::

    ############################################
    ***       THE HEXADECIMAL LOTTERY        ***
    ***     Reward doubles every minute!     ***
    ############################################

    *** This is MINUTE n

How many minutes ago the lottery started gives us an estimate of the current unix timestamp when the
lottery was started. If we can narrow things down further by noticing when `n` minutes becomes `n+1`
minutes then we'll only have 1 or 2 guesses to try.

We can run the lottery and pipe the output to a file using::

    ./hex-lottery ffffffff > output-hex-lottery.txt

Now we need to identify the current minute from that output.

Find the second the CSPRNG was started
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
@TODO

Predict a draw and win the prize!
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
@TODO
