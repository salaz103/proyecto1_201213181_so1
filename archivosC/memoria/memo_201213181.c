#include<linux/proc_fs.h>
#include<linux/seq_file.h>
#include<asm/uaccess.h>
#include<linux/hugetlb.h>
#include<linux/module.h>
#include<linux/init.h>
#include<linux/kernel.h>
#include<linux/fs.h>
#include<sys/sysinfo.h>

#define BUFSIZE 150;

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Luis Salazar");
MODULE_DESCRIPTION("Modulo de memoria");
MODULE_VERSION("0.01");

struct sysinfo inf;

static int escritura_archivo(struct seq_file *archivo, void *v){
    si_meminfo(&inf);
    long total_memoria= inf.totalram;
    long libre_memoria= inf.freeram;
    seq_printf(archivo,"SOPES 1 _ Luis Salazar \n");
    seq_printf(archivo,"* MEMORIA RAM TOTAL= %d KB \n",total_memoria);
    return 0;
}


static int al_abrir(struct inode *inode, struct file *file){
    return single_open(file,escritura_archivo,NULL);
}

static struct file_operations operaciones =
{
    .open = al_abrir,
    .read = seq_read
};


static int inicio(void){
    proc_create("memo_201213181",0,NULL,&operaciones);
    printk(KERN_INFO "%s","CARGANDO MODULO - 201213181 \n");

    return 0;
}

void salir (void){
    remove_proc_entry("memo_201213181",NULL);
    printk(KERN_INFO "%s","QUITANDO MODULO - Sistemas Operativos 1\n");
}

module_init(inicio);
module_exit(salir);
