/** @type NodeFsModule */
var fs = require('fs');
/** @type NodePathModule */
var path = require('path');
var _ = require('underscore');

module.exports = {
	/**
	 * Read file content and return it
	 * @param {String} path File's relative or absolute path
	 * @return {String}
	 */
	read: function(path) {
		return _.map(fs.readFileSync(path), function(b) {
			return String.fromCharCode(b);
		}).join('');
	},
	
	/**
	 * Locate <code>file_name</code> file that relates to <code>editor_file</code>.
	 * File name may be absolute or relative path
	 * 
	 * <b>Dealing with absolute path.</b>
	 * Many modern editors have a "project" support as information unit, but you
	 * should not rely on project path to find file with absolute path. First,
	 * it requires user to create a project before using this method (and this 
	 * is not very convenient). Second, project path doesn't always points to
	 * to website's document root folder: it may point, for example, to an 
	 * upper folder which contains server-side scripts.
	 * 
	 * For better result, you should use the following algorithm in locating
	 * absolute resources:
	 * 1) Get parent folder for <code>editorFile</code> as a start point
	 * 2) Append required <code>fileName</code> to start point and test if
	 * file exists
	 * 3) If it doesn't exists, move start point one level up (to parent folder)
	 * and repeat step 2.
	 * 
	 * @param {String} editorFile
	 * @param {String} fileName
	 * @return {String} Returns null if <code>fileName</code> cannot be located
	 */
	locateFile: function(editorFile, fileName) {
		var dirname = editorFile, f;
		fileName = fileName.replace(/^\/+/, '');
		while (dirname && dirname !== path.dirname(dirname)) {
			dirname = path.dirname(dirname);
			f = path.join(dirname, fileName);
			if (fs.existsSync(f))
				return f;
		}
		
		return '';
	},
	
	/**
	 * Creates absolute path by concatenating <code>parent</code> and <code>fileName</code>.
	 * If <code>parent</code> points to file, its parent directory is used
	 * @param {String} parent
	 * @param {String} fileName
	 * @return {String}
	 */
	createPath: function(parent, fileName) {
		var stat = fs.statSync(parent);
		if (stat && stat.isDirectory()) {
			parent = path.dirname(parent);
		}
		
		return path.resolve(parent, fileName);
	},
	
	/**
	 * Saves <code>content</code> as <code>file</code>
	 * @param {String} file File's absolute path
	 * @param {String} content File content
	 */
	save: function(file, content) {
		fs.writeFileSync(file, content, 'ascii');
	},
	
	/**
	 * Returns file extension in lower case
	 * @param {String} file
	 * @return {String}
	 */
	getExt: function(file) {
		var m = (file || '').match(/\.([\w\-]+)$/);
		return m ? m[1].toLowerCase() : '';
	}
};