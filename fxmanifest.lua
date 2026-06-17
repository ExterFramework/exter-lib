fx_version 'cerulean'
games {'gta5'}
lua54 'yes'

author 'sobing'

description 'exter-library v2.0 - Modern UI Library'

version '2.0'

ui_page 'html/index.html'

files {
  'html/index.html',
  'html/*.js',
  'html/*.css',
  'html/*.png',
  'html/*.JPG',
  'html/*.svg',
  'html/sounds/*.ogg',
  'html/*.woff',
  'html/*.otf',
  'html/weaponimages/*.png'
}

client_scripts {
    'client.lua'
}

exports {
  'Progress',
}
