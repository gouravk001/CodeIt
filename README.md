#CodeIt


CodeIt is a Coding site just like codeforces where you can go and practice competitive programming questions as much as you want, at least that what i would hope to say
but i alone can't make hundreds of test cases for thousands of problems. Anyway let me give a insight as to how my site works:


The main heart of this site is the IDE and how the test cases are evaluated in the backend. At first I had tried to use Docker on a AWS EC2 Virtual Machine to host 
judge0, a very popular code executor which provides various of compiler options to execute and allows to set time limits and memory limit on the execution of the test cases. You can read more about it here 👉 ( https://github.com/judge0/judge0/tree/master ).

The issue with using judge0 was that it is quite heavy and AWS only provides 2 vCPU and 1 gb RAM for free so when i would try to run judge0, the VM would always crash.
So I opted to using judge0 API instead. I think its good enough for a project.

The tech stack I used was MERN Stack and deployed the site on Render.


<img width="1916" height="954" alt="image" src="https://github.com/user-attachments/assets/fda91d92-292e-4fd1-8e5b-657ab630d8af" />

I also created this problem setting page for the problem setters. Only admins can create a problem and add it to the site.

<img width="1916" height="963" alt="image" src="https://github.com/user-attachments/assets/467c0e0e-e445-45cb-bbf6-b2d2ba38d69d" />

This is the problem page, I used the monaco editor as the code editor as it was simple to setup and very easy to use. You can check it out here 👉(https://www.npmjs.com/package/@monaco-editor/react).

All the API calls to the judge0 is done in the backend and evaluation and storing of the submissions is also done in the backend.

I also used JWT( Json Web Token ) to allow session persistence after Signup.

This is the link to my project - (https://codeit-frontend.onrender.com)
