'''
Setup file for cp_randomness

@author: Howard Chivers

Copyright (c) 2015, Howard Chivers
All rights reserved.
'''

from setuptools import setup

setup(
    name='cp_randomness',

    version='0.1.0',

    description='cp_randomness Randomness and PRNG Experiment',

    author='Michael Mokrysz',
    author_email='mm911@york.ac.uk',
    url="https://www.cs.york.ac.uk/cyber-practicals/",

    license='BSD New',

    classifiers=['Development Status :: 4 - Beta',
                 'Intended Audience :: Developers',
                 'License :: OSI Approved :: BSD License',
                 'Operating System :: OS Independent',
                 'Programming Language :: Python :: 3',
                 'Topic :: Scientific/Engineering :: Information Analysis',
                 'Topic :: Security',
                 ],

    install_requires=["Tyche==1.0", "bcrypt>=3.1.0", "readchar==0.7"],

    keywords='random prng education',

    packages=['cp_randomness', 'cp_randomness.exercise1', 'cp_randomness.exercise2'],
    package_dir={'cp_randomness': 'cp_randomness'},
    entry_points={},
    package_data={}
)
