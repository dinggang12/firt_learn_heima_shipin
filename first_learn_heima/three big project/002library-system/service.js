/*业务模块*/

const fs =require('fs');
const path=require('path');
//渲染页面需要数据，引入数据
const data=require('./data.json');
//将数据放到模板里面

//自动生成图书编号

let maxBookCode=()=>{
	let arr=[];
	data.forEach((item)=>{
		arr.push(item.id);
	});
	 return Math.max.apply(null,arr);
}

//渲染主页面
exports.showIndex=(req,res)=>{
	res.render('index',{list:data});//传模板的文件名字，和数据
}


//跳转到添加图书的页面
//
exports.toAddBook=(req,res)=>{
	res.render('addBook',{});//传添加图书模板页面的路径
}


//添加图书并且保存数据
exports.addBook=(req,res)=>{
	//获取表单数据
	let info=req.body;
	let book={};
	for(let key in info){
		book[key]=info[key]
	}
	book.id=maxBookCode()+1;
	data.push(book);//需要把内存中的数据写入文件s
	fs.writeFile(path.join(__dirname,'data.json'),JSON.stringify(data,null,4),(err)=>{
		if(err){
			res.send('server error');
		}else{
			//文件写入成功后，重新跳转到主页面
			res.redirect('/');
		}
	});
}

//跳转到编辑页面
exports.toEditBook=(req,res)=>{
	let id=req.query.id;
	let book={};
	data.forEach((item)=>{
		if(id==item.id){
			book=item;
			return 
		}
	});
	res.render('editBook',book);
}


/*编辑图书更新数据*/
exports.editBook=(req,res)=>{
	let info=req.body;
	data.forEach((item)=>{
		if(info.id==item.id){
			for(let key in info){	
				item[key]=info[key];
			}
			return 
		};
	});
	fs.writeFile(path.join(__dirname,'data.json'),JSON.stringify(data,null,4),(err)=>{
		if(err){
			res.send('server error');
		}else{
			//文件写入成功后，重新跳转到主页面
			res.redirect('/');
		}
	});
}

/*删除图书信息*/
exports.deleteBook=(req,res)=>{
	let id =req.query.id;
	data.forEach((item,index)=>{
		if(id==item.id){
			data.splice(index,1);
		}
		return
	});
	fs.writeFile(path.join(__dirname,'data.json'),JSON.stringify(data,null,4),(err)=>{
		if(err){
			res.send('server error');
		}else{
			//文件写入成功后，重新跳转到主页面
			res.redirect('/');
		}
	});
}
	