const fs = require('fs');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const path = require('path');

// 获取文件夹名称
const set = new Set();
fs.readdirSync('./').forEach((item) => {
	if (item.substring(0, 10) === 'smartsport' || item === 'standard-lesson-plan-service' || item === 'teacher-lesson-plan-service') {
		set.add(item);
	}
});
const pathArr = [...set];

const pullErrObj = {};
const rebaseErrObj = {};
const pushErrObj = {};
let i = 0;
pathArr.forEach((item) => {
	// 切换dev分支并拉取代码，可能会有没有dev分支的项目，错误不影响脚本
	exec('git checkout dev', {cwd: path.join(__dirname, item)}, (err, result) => {
		exec('git pull', {cwd: path.join(__dirname, item)}, (err, result) => {
			if (err) {
				pullErrObj[item] = err;
			}
			console.log(`----------------------------------------git pull to ${item}----------------------------------------`);
			console.log(err);
			console.log(result);
			console.log(`----------------------------------------git pull to ${item}----------------------------------------\n\n`);

			exec('git checkout master', {cwd: path.join(__dirname, item)}, (err, result) => {
				exec('git rebase dev', {cwd: path.join(__dirname, item)}, (err, result) => {
					if (err) {
						rebaseErrObj[item] = err;
					}
					console.log(`----------------------------------------git rebase dev to ${item}----------------------------------------`);
					console.log(err);
					console.log(result);
					console.log(`----------------------------------------git rebase dev to ${item}----------------------------------------\n\n`);
					exec('git push origin master', {cwd: path.join(__dirname, item)}, (err, result) => {
						if (err) {
							pushErrObj[item] = err;
						}
						console.log(`----------------------------------------git push master to ${item}----------------------------------------`);
						console.log(err);
						console.log(result);
						console.log(`----------------------------------------git push master to ${item}----------------------------------------\n\n`);
						i++;
					})
				})
			})
		})
	})
})
