# include <stdio.h>
int main ()
{
int fd1, fd2;
printf("This would create two files");
fd1= creat("txt1.txt", 0777);
fd2= creat("txt2.txt", 0777);
}