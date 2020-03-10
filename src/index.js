import program from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import download from 'download-git-repo';
import fs from 'fs';
import tplObj from '../template.json';

export function cli(args) {
// 定义当前版本
// 定义使用方法
// 定义四个指令
// program
//   .version(require('../package').version)
//   .usage('<command> [options]')
//   .command('add', 'add a new template')
//   .command('delete', 'delete a template')
//   .command('list', 'list all the templates')
//   .command('init', 'generate a new project from a template')

program
    .command('add')
    .description('add a new template')
    .action(async function(option) {
        const answers = await inquirer.prompt(questionAdd);
        let {name, url} = answers;
        // 过滤 unicode 字符
        tplObj[name] = url.replace(/[\u0000-\u0019]/g, '')
        fs.writeFile(`${__dirname}/../template.json`, JSON.stringify(tplObj), 'utf-8', err => {
            if (err) console.log(err)
            console.log('\n')
            console.log(chalk.green('Added successfully!\n'))
            console.log(chalk.grey('The latest template list is: \n'))
            console.log(tplObj)
            console.log('\n')
        })
    })

program
    .command('delete')
    .description('delete a new template')
    .action(async function(opton) {
        const answers = await inquirer.prompt(questionDel);
        let {name} = answers;
        delete tplObj[name];
        fs.writeFile(`${__dirname}/../template.json`, JSON.stringify(tplObj), 'utf-8', err => {
            if (err) console.log(err)
            console.log('\n')
            console.log(chalk.green('Deleted successfully!\n'))
            console.log(chalk.grey('The latest template list is: \n'))
            console.log(tplObj)
            console.log('\n')
        })
    })

program
    .command('list')
    .description('list all template')
    .action(function(option) {
        console.log(tplObj)
    })

program
    .command('init <template-name> [project-name]')
    .description('init a project')
    .action(async function(templateName, projectName) {
        console.log(templateName, projectName)
        if (!templateName) return program.help()
        if (!tplObj[templateName]) {
            console.log(chalk.red('\n Template does not exit! \n '))
            return
          }
          if (!projectName) {
            console.log(chalk.red('\n Project should not be empty! \n '))
            return
          }

        const url = tplObj[templateName]
        console.log(chalk.red(`url: ${url}`))

        console.log(chalk.white('\n Start generating.... \n'))

        const spinner = ora('Downloading...')
        spinner.start();
        download(url, projectName, err => {
            if (err) {
                spinner.fail();
                console.log(chalk.red(`generaion failed.. ${err}`))
                return
            }

            spinner.succeed();
            console.log(chalk.green('\n Generation completed!'))
            console.log('\n To get started')
            console.log(`\n    cd ${projectName} \n`)
        })
    })
  
    // 解析命令行参数
    program.parse(process.argv)
}

const questionAdd = [
    {
        name: 'name',
        type: 'input',
        message: '请输入模板名称',
        validate(val) {
            if (val === '') {
                return 'Name is required!'
              } else if (tplObj[val]) {
                return 'Template has already existed!'
              } else {
                return true
              }
        }
    },
    {
        name: 'url',
        type: 'input',
        message: '请输入模板地址',
        validate(val) {
            if (val === '') return 'The url is required!'
            return true
        }
    }
];

const questionDel = [
    {
        name: 'name',
        message: "请输入要删除的模板名称",
        validate(val) {
            if (val === '') {
                return 'name is required'
            } else if (!tplObj[val]) {
                return 'template does not exist'
            } else {
                return true
            }
        }
    }
]

