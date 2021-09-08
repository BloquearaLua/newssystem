# 全球新闻发布管理系统

项目主要使用react-hook，用json-server模拟数据。

包括：首页，用户管理，权限管理，新闻管理，审核管理，发布管理。
其中首页可进行可视化查看发过的数据。

## 安装

### json-server

    npm i json-server

### 打开服务器

在db.json文件的文件夹下，打开终端,输入：

	json-server --watch db.json --port 5000

#### 使用
	
1. 获取数据

        axios.get("http://localhost:8000/posts/1").then(resolve => {
    		console.log(resolve.data);
    	});

2. 查看数据，id自增
	
	     axios.post("http://localhost:8000/comments", {
    	 	title: "test01",
    	 	author: "my",
    	 	body: "omg...",
    		postId: 2
         });

3. 修改内容，替换修改，put里面的对象会直接代替comment里id为2的
    
     	axios.put("http://localhost:8000/comments/2", {
     		title: "change"
     	})

4. 修改内容，局部修改，修改对象里对应的内容，其它不变
		 
		axios.patch("http://localhost:8000/comments/2", {
             title:"change2",
             postId:2
         })

5. 删除

		axios.delete("http://localhost:8000/comments/3")

6. _embed，向下合并表

		axios.get("http://localhost:8000/posts?_embed=comments").then(res => {
             console.log(res.data);
        })

7. _expand,向上合并

		axios.get("http://localhost:8000/comments?_expand=post").then(res => {
             console.log(res.data);
         })

