#!/usr/bin/env ruby
# encoding: utf-8
require 'rubygems'
#require 'htmlentities'
#require 'unicode'

$localOnline = :online

root = '/Users/sara/Dropbox/prjcts/else/jcv/qhha/source/' #Dir.pwd+'/'
publicDir =  root.gsub(/source\/$/,'')
head = ''
template = ''
footer = ''
$logos = ''
$feedback = ''


def parse str
	other = $localOnline == :online ? :local : :online
	str.gsub!(/{{#{$localOnline}Only(Start|End)}}/, '')
	str.gsub!(/{{#{other}OnlyStart}}[\s\S]*?{{#{other}OnlyEnd}}/x, '')
	str
end

def readAndEncode f
	parse(File.read(f, :encoding => 'utf-8')).
		gsub(/{{logos}}/, $logos).
		gsub(/{{feedback}}/, $feedback)
end

File.open(root+"logos.html") do |f|
	$logos = readAndEncode( f )
end
File.open(root+"feedback.html") do |f|
	$feedback = readAndEncode( f )
end

File.open(root+"head.html") do |f|
	head = readAndEncode( f )
end
File.open(root+"footer.html") do |f|
	footer = readAndEncode( f )
end

def readProps( html, props ) out = {}
	props.each do |prop|
		maybe = html.match(/^\s*#{prop}:(.*)$/)
		out[prop] = maybe ? maybe[1].strip : ''
	end
	out
end
def replaceProps( html, props ) 
	props.each do |key, value|
		html.gsub!(/{{#{key}}}/, value)
	end
	html
end

pages = ['index', 'guadalajara', 'zapopan']

pages.each do |page|
	if false
		pausa = '<!doctype html><html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en"><head><title>Qué has hecho, alcalde</title></head><body style="text-align:center; margin:2em; background:#E0E0E2 url(/img/pausa-bkg.png);"><img src="/img/pausa.jpg" style="width:600px" /></body>'
		publicHtml = publicDir+(
			(page == 'index') ?
				'index' :
				(page+'/index')
		)+'.html'

		File.open(publicHtml, "w+").write(
			pausa
		)
		puts 'Published: '+page
		next
	end

	File.open(root+"template.html") do |f|
		template = readAndEncode( f )
	end
	File.open(root+page+".html") do |f|
		html = readAndEncode( f )

		# FRONT MATTER
		props = readProps( html, %w(title short alcalde apellido email telefono twitter bio) )

		headTemp = replaceProps( head, props );
		if( page == 'guadalajara' or page == 'zapopan')
			html = replaceProps( template, props)
		end

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
