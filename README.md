#Apache访问验证
两种用于验证客户端身份的方法

##1. 使用WWW-Authenticate报头字段
	<Directory "${DIR}">
		#使用CORS+AJAX的时候要发送附加的WWW-Authenticate
		#需要使用OPTION PDU的preflight请求包查询允许发送的包头
		#这种数据包不需要认证，排除在外
		<LimitExcept OPTIONS>
			AuthType Basic
			AuthName "Authentication"
			AuthBasicProvider file
			AuthUserFile ${PASSWORD_FILE}
			Require user ${USER_LIST}
		</LimitExcept>
		AllowOverride AuthConfig
	</Directory>

##2. 使用SSL进行双向认证
###1. 安装apache ssl模块
	yum install mod-ssl
###2. 生成自己的CA根密钥
	openssl genrsa -out myca.key 2048
	openssl req -new -key myca.key -out myca.csr
	openssl x509 -req -days 3650 -shda1 -extensions v3_ca -signkey myca.key -in myca.csr -out myca.crt
###3. 生成服务器证书和客户端证书
	#服务器证书
	openssl genrsa -out server.key 2048
	openssl req -new -key server.key -out server.csr
	openssl x509 -req -days 3650 -extensions v3_req -CA myca.crt -CAkey myca.key -CAserial ca.srl -CAcreateserial -in server.csr -out server.crt
	#客户端证书
	openssl genrsa -out client.key 2048
	openssl req -new -key client.key -out client.csr
	openssl x509 -req -days 3650 -extensions v3_req -CA myca.crt -CAkey myca.key -CAserial ca.srl -CAcreateserial -in client.csr -out client.crt
	#客户端证书需要导出为pkcs12格式
	openssl pkcs12 -export -clcerts -in client.crt -inkey client.key -out client.p12
###4. 修改httpd.conf和ssl.conf
####4.1 httpd.conf
把所有的HTTP传入连接重定向到HTTPS连接上

	<Directory "${DIR}">
		#需要客户端验证                                                
		SSLVerifyClient require
		#重定向HTTP连接
		RewriteEngine On      
		RewriteCond %{HTTPS} !=on
		RewriteRule ^.*$ https://%{SERVER_NAME}%{REQUEST_URI} [L,R]
	</Directory>
####4.2 ssl.conf
设置服务器证书和CA证书

	
	<VirtualHost *:443>
		#其余选项不列出
		...
		#服务器证书文件
		SSLCertificateFile ${SERVER_CRT}
		#服务器私钥文件
		SSLCertificateKeyFile ${SERVER_KEY}
		#CA证书 用于服务器证书链
		SSLCertificateChainFile ${CA_CRT}
		#CA证书 用于客户端证书链
		SSLCACertificateFile ${CA_CRT}
		...
	</VirtualHost>
###5. Apache域名解析
需要在httpd.conf和ssl.conf中配置`NameVirtualHost`

	NameVirtualHost *:80
	NameVirtualHost *:443

然后配置`VirtualHost`组中的`ServerName`即可。