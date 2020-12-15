#include <linux/proc_fs.h>
#include <linux/seq_file.h>
#include <asm/uaccess.h>
#include <linux/hugetlb.h>
#include <linux/module.h>
#include <linux/init.h>
#include <linux/kernel.h>
#include <linux/fs.h>
#include <linux/sched.h>
#include <linux/sched/signal.h>

#define BUFSIZE 150;


#define TASK_RUNNING 0
#define TASK_INTERRUPTIBLE 1
#define TASK_UNINTERRUPTIBLE 2
#define TASK_ZOMBIE 4
#define TASK_STOPPED 8



MODULE_LICENSE("GPL");
MODULE_AUTHOR("Luis Salazar");
MODULE_DESCRIPTION("Modulo de CPU");
MODULE_VERSION("0.01");

struct task_struct *proceso;
struct task_struct *procesos_hijos;
struct list_head *lista_hijos;
struct list_head sibling;

static int escritura_archivo(struct seq_file *archivo, void *v){
    seq_printf(archivo,"SOPES 1 _ Luis Salazar \n");
    
    
    /*seq_printf(archivo,"* PROCESOS EN EJECUCION: %d \n",TASK_RUNNING);
    seq_printf(archivo,"* PROCESOS SUSPENDIDOS: %d \n",TASK_INTERRUPTIBLE);
    seq_printf(archivo,"* PROCESOS DETENIDOS: %d \n",TASK_STOPPED);
    seq_printf(archivo,"* PROCESOS ZOMBIE: %d \n",TASK_ZOMBIE);*/
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
    proc_create("cpu_201213181",0,NULL,&operaciones);
    printk(KERN_INFO "%s","CARGANDO MODULO - Luis Salazar \n");
    int ejecucion=0;
    int suspendidos=0;
    int detenidos=0;
    int zombies=0;
    int total_procesos=0;
    for_each_process(proceso){
        //printk(KERN_INFO "PID: %d  PROCESO:%s  ESTADO:%ld", proceso->pid, proceso->comm, proceso->state);
        /*list_for_each(lista_hijos,&proceso->children){

            procesos_hijos= list_entry(lista_hijos, struct task_struct, sibling);

            printk(KERN_INFO "HIJO DEL PROCESO: %s CON PID: %d  PROCESO HIJO: %s  PID HIJO:%d  ESTADO HIJO: %ld ", proceso->comm, proceso->pid, procesos_hijos->pid, procesos_hijos->state);
        }*/
        if(proceso->state==TASK_RUNNING){
            ejecucion++;
        }else if(proceso->state==TASK_INTERRUPTIBLE){
            suspendidos++;
        }else if(proceso->state==TASK_STOPPED){
            detenidos++;
        }else if(proceso->state==TASK_ZOMBIE){
            zombies++;
        }

        total_procesos++;

    }

        printk(KERN_INFO "PROCESOS EN EJECUCION: %d \n", ejecucion);
        printk(KERN_INFO "PROCESOS SUSPENDIDOS: %d \n", suspendidos);
        printk(KERN_INFO "PROCESOS DETENIDOS: %d \n", detenidos);
        printk(KERN_INFO "PROCESOS ZOMBIE: %d \n", zombies);
        printk(KERN_INFO "TOTAL DE PROCESOS: %d \n", total_procesos);

    return 0;
}

void salir (void){
    remove_proc_entry("cpu_201213181",NULL);
    printk(KERN_INFO "%s","QUITANDO MODULO - Diciembre 2020 \n");
}

module_init(inicio);
module_exit(salir);
