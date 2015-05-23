<?php
	if (empty($_POST)) die();
		
	// set up directories
	$base_dir = dirname(dirname(dirname(dirname(__FILE__)))).'/';
	$static_dir = $base_dir.'static/';
	$images_subdir = 'media/images/'.date('Y/m/');
	$images_dir = $static_dir.$images_subdir;
	$posts_dir = $base_dir.'content/post/'.date('Y/m/');
	
	// set up URLs
	$protocol = stripos($_SERVER['SERVER_PROTOCOL'],'https') === true ? 'https://' : 'http://';
	$domain = $_SERVER['SERVER_NAME'];
	$url_path = $_SERVER['PHP_SELF'];
	$images_base_url = $protocol.$domain.'/'.$images_subdir;
	$post_base_url = $protocol.$domain.date('/Y/m/d/');
	
	// create images dir if it doesn't already exist
	if (!file_exists($images_dir)) {
		mkdir($images_dir,0755,true);
	}
		
	// creaet posts dir if it doesn't already exist
	if (!file_exists($posts_dir)) {
		mkdir($posts_dir,0755,true);
	}
		
	//get the post data and decode it
	$post_data = json_decode($_POST['payload'], true);
	
	//generate the post file name
	preg_match("/title:\\s*(.*)/u", $post_data['content'], $post_name);
	$post_data['filename'] = urlencode(str_replace(' ', '-', strtolower($post_name[1])));
	$post_filename = $posts_dir.$post_data['filename'].'.md';
	
	//generate the post URL
	$post_url = $post_base_url.$post_data['filename'];
	
	//process any images referenced in the post
	$num_images = preg_match_all("/!\\[(.+)\\]\\((.+)[\\)|\\s]/uU", $post_data['content'], $post_images);
																		
	if ($num_images > 0) {
		$post_image_names = $post_images[1];
		$post_image_urls = $post_images[2];
		
		for($i=0; $i<$num_images; $i++) {
			$image_url = $post_image_urls[$i];			
			$image_base_filename = $post_data['filename'].'_image_'.$i;			
			$image_base_path = $images_dir.$image_base_filename;
			
			// make a local copy of the image
			copy($image_url, $image_base_path);
		
			// get the image info (size and type)
			$image_info = getimagesize($image_base_path);
			list($width, $height) = $image_info;

			// creaate a copy of the image in memory			
			switch ($image_info['mime']) {
			case 'image/gif':
			    $extension = '.gif';
			    $src = imagecreatefromgif($image_base_path);
			    break;
			case 'image/jpeg':
			    $extension = '.jpg';
			    $src = imagecreatefromjpeg($image_base_path);
			    break;
			case 'image/png':        
			    $extension = '.png';
			    $src = imagecreatefrompng($image_base_path);
			    break;
			default:
			    $extension = '';
			    break;
			}
			
			// calculate the new image size (if it's larger than 800px wide)
			if ($width > 800) {
				$new_width = 800;
				$new_height = intval((800/$width)*$height);
			} else {
				$new_width = $width;
				$new_height = $height;
			}
			
			// generate a new image in memory of the correct size
			$tmp = imagecreatetruecolor($new_width, $new_height);
			
			// set the background to white (in case the image has an alpha channel)
			$kek=imagecolorallocate($tmp, 255, 255, 255);
			imagefill($tmp,0,0,$kek);

			// resize the image
			imagecopyresampled($tmp, $src, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
			
			// format the new image as a jpg (to save space) and save it
			imagejpeg($tmp,$image_base_path.'.jpg', 80);
			
			// delete the originally downloaded image
			unlink($image_base_path);
			
			// replace the original URL with the url of the new jpg
			$post_data['content'] = str_replace($image_url, $images_base_url.$image_base_filename.'.jpg', $post_data['content']);
		}
	}
	
	// save the post
	file_put_contents($post_filename, $post_data['content']);
	
	// rebuild the site
	exec('echo "----------" >> ~/tmp/hugo.$(date +"%Y%m%d").log');
	exec('echo $(date +"%Y-%m-%d %H:%M") >> ~/tmp/hugo.$(date +"%Y%m%d").log');
	exec('hugo -s '.$base_dir.' >> ~/tmp/hugo.$(date +"%Y%m%d").log');

	// let the calling process know where this is posted
	header('Location: '.$post_url);

	// we're done!
	die();
	
	