'''
Setup file for randompy

@author: Howard Chivers

Copyright (c) 2015, Howard Chivers
All rights reserved.
'''

from setuptools import setup
from os import path, listdir

here = path.abspath(path.dirname(__file__))
with open(path.join(here, 'README.txt')) as f:
    long_description = f.read()


def getRefFiles(base, root):
    rf = []
    for f in listdir(path.join(base, root)):
        p = path.join(root, f)
        if path.isdir(path.join(base, p)):
            rf.extend(getRefFiles(base, p))
        else:
            rf.append(p)
    return rf

dbinfermod  = path.join(here, 'randompy')
#refFiles = getRefFiles(dbinfermod, 'data')

setup(
    name='randompy',

    version='0.0.2',

    description='randompy Randomness and PRNG Experiment',
    long_description=long_description,

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

    install_requires=["Tyche==1.0"],

    keywords='random prng education',

    packages=['randompy', 'randompy.exercise1', 'randompy.exercise2'],
    package_dir={'randompy': 'randompy'},

    entry_points={},#'console_scripts': ['randompy = randompy.__main__:main']},

    package_data={}#'randompy': refFiles}
)
