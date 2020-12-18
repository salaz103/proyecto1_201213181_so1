#include <linux/proc_fs.h>
#include <linux/seq_file.h>
#include <asm/uaccess.h>
#include <linux/hugetlb.h>
#include <linux/sched/signal.h>
#include <linux/sched.h>
#include <linux/module.h>
#include <linux/init.h>
#include <linux/kernel.h>
#include <linux/fs.h>

struct list_head *p;
struct task_struct *proceso, ts, *tsk;

#define BUFSIZE 150

#define TASK_RUNNING 0x0000
#define TASK_INTERRUPTIBLE 0x0001
#define TASK_UNINTERRUPTIBLE 0x0002
#define __TASK_STOPPED 0x0004
/* Used in tsk->exit_state: */
#define EXIT_ZOMBIE 0x0020
#define EXIT_TRACE (EXIT_ZOMBIE | EXIT_DEAD)

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Luis Salazar");
MODULE_DESCRIPTION("Modulo de CPU");
MODULE_VERSION("0.01");

static int escribir_archivo(struct seq_file *archivo, void *v)
{
    //CONTADORES
    unsigned int total = 0;
    unsigned int ejecucion = 0;
    unsigned int suspendidos = 0;
    unsigned int detenidos = 0;
    unsigned int zombies = 0;
    unsigned int otros = 0;

    int pros = 0;
    int pros2 = 0;
    seq_printf(archivo, "{\n");
    seq_printf(archivo, "\"procesos\":[\n");

    bool seconditerative = false;

    for_each_process(proceso)
    {

        if (pros > 0)
        {
            seq_printf(archivo, ",");
        }

        seq_printf(archivo, "{\n");
        seq_printf(archivo, "\"PID\": %d, \n", proceso->pid);
        seq_printf(archivo, "\"Nombre\": \"%s\", \n", proceso->comm);
        seq_printf(archivo, "\"Usuario\": %d, \n", proceso->cred->uid);
        //seq_printf(archivo, "\"Estado\": %s, \n", obtener_estado(proceso->state));
        //seq_printf(archivo, "\"Estado\": %li, \n", proceso->state);
        if (proceso->exit_state == EXIT_ZOMBIE)
        {
            seq_printf(archivo, "\"Estado\": \"%s\", \n", "ZOMBIE");
            zombies++;
        }
        else
        {
            switch (proceso->state)
            {
            case TASK_RUNNING:
                seq_printf(archivo, "\"Estado\": \"%s\", \n", "EJECUCION");
                ejecucion++;
                break;
            case (TASK_INTERRUPTIBLE | TASK_UNINTERRUPTIBLE):
                seq_printf(archivo, "\"Estado\": \"%s\", \n", "SUSPENDIDO");
                suspendidos++;
                break;
            case (__TASK_STOPPED):
                seq_printf(archivo, "\"Estado\": \"%s\", \n", "DETENIDO");
                detenidos++;
                break;
            default:
                seq_printf(archivo, "\"Estado\": \"%s\", \n", "OTROS");
                otros++;
                break;
            }
        }

        if (proceso->mm)
        {
#define Convert(x) ((x) << (PAGE_SHIFT - 10))
            seq_printf(archivo, "\"Memoria\": %lu, \n", Convert(get_mm_rss(proceso->mm)));
#undef k
        }
        seq_printf(archivo, "\"hijos\":");
        seq_printf(archivo, "[");
        pros2 = 0;
        //AHORA COMENZAMOS A RECORRER LOS HIJOS DEL PROCESO ACTUAL
        list_for_each(p, &(proceso->children))
        {
            if (pros2 > 0)
            {
                seq_printf(archivo, ",");
            }
            seq_printf(archivo, "{\n");
            ts = *list_entry(p, struct task_struct, sibling);
            seq_printf(archivo, "     \"Proceso padre\":%d,\n", proceso->pid);
            seq_printf(archivo, "     \"PID\":%d, \n", ts.pid);
            seq_printf(archivo, "     \"Nombre\":\"%s\",\n", ts.comm);
            seq_printf(archivo, "     \"Estado\":%lu \n", ts.state);
            //seq_printf(archivo, "     \"Estado\":%s \n", obtener_estado(ts.state));
            seq_printf(archivo, "}\n");
            pros2++;
        }
        seq_printf(archivo, "]\n");
        seq_printf(archivo, "}\n");
        pros++;
        //SUMO EL PROCESO ACTUAL
        total++;
    }
    seq_printf(archivo, "],\n");
    //VAMOS AGREGAR EL RESUMEN DE PROCESOS
    seq_printf(archivo, "\"ejecucion\":%d,\n", ejecucion);
    seq_printf(archivo, "\"suspendidos\":%d,\n", suspendidos);
    seq_printf(archivo, "\"detenidos\":%d,\n", detenidos);
    seq_printf(archivo, "\"zombies\":%d,\n", zombies);
    seq_printf(archivo, "\"otros\":%d,\n", otros);
    seq_printf(archivo, "\"total\":%d\n", total);
    seq_printf(archivo, "}\n");

    return 0;
}

static int al_abrir(struct inode *inode, struct file *file)
{
    return single_open(file, escribir_archivo, NULL);
}

static struct file_operations operaciones =
    {
        .open = al_abrir,
        .read = seq_read

};

static int iniciar(void)
{
    proc_create("cpu_201213181", 0, NULL, &operaciones);
    printk(KERN_INFO "CARGANDO MODULO CPU - Luis Salazar\n");
    return 0;
}

static void salir(void)
{
    remove_proc_entry("cpu_201213181", NULL);
    printk(KERN_INFO "QUITANDO MODULO CPU -  Diciembre 2020 \n");
}

module_init(iniciar);
module_exit(salir);