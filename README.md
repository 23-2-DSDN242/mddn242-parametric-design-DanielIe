[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/ihfjUrzT)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=11592010&assignment_repo_type=AssignmentRepo)
## MDDN 242 2023 Assignment 2

My letters are themed around computer-glitchyness. They are composed of 10 horizonal lines stacked on top of each other. Each of these lines has a width, and also an optional center cut out (for letters like O). I have 20 parameters. The first 10 are the details of each of the 10 horizontal lines, and the last 10 are the details for the cut outs of each of those lines. The parameter values are carefully chosen such that they can double as both width, and the center x point of the line, so that parameters may be re-used. A similar method is used for the cut-out parameters, doubling as both cut-out width and cut-out center x point. To stylize the letters and make them smoother, I draw multiple lines for each line parameter, interpolating between widths to make a smoother form. In case this description is confusing, I have included an image representing how my parameters translate to my letterforms.

The twenty parameters per letter:

  * `l1` : First line (top-most)
  * `l2` : Second line
  * `l3` : Third line
  * `l4` : Fourth line
  * `l5` : Fifth line
  * `l6` : Sixth line
  * `l7` : Seventh line
  * `l8` : Eighth line
  * `l9` : Ninth line
  * `l10` : Tenth line (bottom-most)
  * `c1` : First line cut-out (top-most)
  * `c2` : Second line cut-out
  * `c3` : Third line cut-out
  * `c4` : Fourth line cut-out
  * `c5` : Fifth line cut-out
  * `c6` : Sixth line cut-out
  * `c7` : Seventh line cut-out
  * `c8` : Eighth line cut-out
  * `c9` : Ninth line cut-out
  * `c10` : Tenth line cut-out (bottom-most)

  ![Alt text](image.png)
