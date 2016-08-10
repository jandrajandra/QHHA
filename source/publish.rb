#!/usr/bin/env ruby
# encoding: utf-8
require 'rubygems'
#require 'htmlentities'
#require 'unicode'
require 'iconv' unless String.method_defined?(:encode) #because http://stackoverflow.com/questions/2982677/ruby-1-9-invalid-byte-sequence-in-utf-8
#ruby -run -ehttpd . -p8000

#$KCODE = 'UTF-8'

root = '/Users/bex/Dropbox/prjcts/else/jcv/qhha/source/' #Dir.pwd+'/'
publicDir =  root.gsub(/source\/$/,'')
head = ''
footer = ''


def readAndEncode f
	File.read(f, :encoding => 'utf-8')
end

File.open(root+"head.html") do |f|
	head = readAndEncode( f )
end
File.open(root+"footer.html") do |f|
	footer = readAndEncode( f )
end

def readProp(prop, html)
	out = html.match(/^\s*#{prop}:(.*)$/);
	out ? out[1].strip : '';
end

pages = ['index', 'guadalajara', 'zapopan', 'tabla']

pages.each do |page|
	File.open(root+page+".html") do |f|
		html = readAndEncode( f )

		# FRONT MATTER
		title = readProp('title', html);
		headTemp = head.gsub(/{{title}}/, title);

		html.gsub!(/---.*?---/m, '') #trim front matter

		unless (File.exists?(publicDir+page) or (page=='index'))
			Dir.mkdir(publicDir+page)
		end

		publicHtml = publicDir+(
			(page == 'index') ?
				'index' :
				(page+'/index')
		)+'.html'

		File.open(publicHtml, "w+").write(
			headTemp + html + footer
		)
		puts 'Published: '+page
	end
end
