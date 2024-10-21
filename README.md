# DoLModRspackExampleTS

## 运行

### 安装依赖

进入到工作区执行

```shell
pnpm install
```

### 构建mod.zip

构建名称为`package.json`中的`name`字段

在工作区中执行

```shell
pnpm build
```
进行构建,构建完的成果物在`dist`目录下存放

## boot.json

### name

使用`package.json`中`name`字段

### version

使用`package.json`中`version`字段

### scriptFileList

在`src/scriptFileList`目录下编写`typescript`脚本,通过`rspack`进行构建

### scriptFileList_preload

在`src/scriptFileList_preload`目录下编写`typescript`脚本,通过`rspack`进行构建

### scriptFileList_earlyload

在`src/scriptFileList_earlyload`目录下编写`typescript`脚本,通过`rspack`进行构建

### scriptFileList_inject_early

在`src/scriptFileList_inject_early`目录下编写`typescript`脚本,通过`rspack`进行构建

### styleFileList

在`src/styleFileList`目录下放置,直接拷贝到`mod.zip`

### tweeFileList

在`src/tweeFileList`目录下放置,直接拷贝到`mod.zip`

### imgFileList

在`src/imgFileList`目录下放置,直接拷贝到`mod.zip`

### replacePatchList

在`src/replacePatchList`目录下放置,直接拷贝到`mod.zip`

### additionFile

在`src/additionFile`目录下放置,直接拷贝到`mod.zip`

### additionBinaryFile

在`src/additionBinaryFile`目录下放置,直接拷贝到`mod.zip`

### addonPlugin

在`src/addonPlugin`目录下将内容添加到`index.ts`文件的数组中,按照`ModBootJsonAddonPlugin`声明格式进行编写

### dependenceInfo

在`src/dependenceInfo`目录下将内容添加到`index.ts`文件的数组中,按照`DependenceInfo`声明格式进行编写