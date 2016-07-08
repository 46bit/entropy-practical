
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
    

Error Exploit
_____________

**Write a program that recovers the password for any given user name.**

Hint:
    This implementation tests the password a character at a time and, if successful, tries to test the 
    next (unless it should be the last character , in which case the presence of a next character is an error).
    A successful character in any position should therefore take longer than a failed character, so it 
    should be possible to test by trying all possible characters in the first position, then when the 
    correct character is found, all in the second, etc.
    
    There are a couple of progamming issues that you need to bear in mind: any test must pass the 
    password policy (see above) and final tests must be the correct length for the particular password, 
    which is unknown to you (it is between 8 and 16). 

Do not expect your attack to work everytime, but it should work often. 



    





