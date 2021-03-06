<?php

	  echo '<div class="wrap"><h2>GeoPress Documentation</h2>';
	  ?>
	  <h3>About GeoPress</h3>
	  <p>GeoPress is a tool to help you embed geographic locations into your blog posts, and also include this information in your RSS/Atom syndicated feeds using the <a href="http://georss.org" title="GeoRSS.org website">GeoRSS</a> standard.</p>
	  <p>To begin using GeoPress, write a new article and enter a location name a geographic address in the appropriate fields. Press <em>enter</em>, or click the <em>Geocode</em> button to verify on the map that this is the appropriate location. Additionally, you can click on the map to set a location. Once you save your post, the geographic location is stored with the post entry. If you want to just enter latitude and longitude, then enter <code>[latitude, longitude]</code> into the address field.</p>
	  <p>Notice to users of WordPress 2.1+: there are now default privacy settings that prevent your blog from pinging Blog aggregators like <a href="http://technorati.com/">Technorati</a> or <a href="http://mapufacture.com/">Mapufacture</a>, or being searched by <a href="http://www.google.com/">Google</a>. To change your privacy settings, go to "Options" -> "Privacy" and allow your blog to be visible by anyone. This will let aggregators and search engines allow users and readers to find your blog.</p>
	  <h4>Adding to your post</h4>
	  <p>You can insert a dynamic map into your post automatically by selecting "Automatically add a map after any post" in the GeoPress options tab. This map will be inserted at the end of any post that has a location set for it.</p>
	  <p>Alternatively, you can manually insert a map by putting <code>INSERT_MAP</code> anywhere in your post text. The map will use the default map size as sent in your GeoPress options. You can override this size by passing in INSERT_MAP(width,height), where height and width are the size of the map, in pixels.</p>
	  <p>You can also insert the geographic coordinates, or address of the post by using <code>INSERT_COORDS</code>, and <code>INSERT_ADDRESS</code>, respectively. These will be output using <a href="http://microformats.org" title="Microformats homepage">Microformat</a> styling. </p>
	  <p>INSERT_LOCATION will put in the stored name of the location into a post.</p>
	  <p>INSERT_MAP(width,height,url) will add a map for the post and also a KML or GeoRSS Overlay from the URL.</p>
	  <p>A map of all your geotagged posts can be inserted by using INSERT_GEOPRESS_MAP(width,height).</p>
	  <p>You can set the location of a post within the body of the post itself by using <code>GEOPRESS_LOCATION(Location String)</code>, where <em>Location String</em> can be any text that normally works in the GeoPress location box. For example address, city, region, country, etc. You can also post coordinates by doing <code>GEOPRESS_LOCATION([latitude,longitude]). An alternative is to use machine-tags in the Post, like <code>tags: geo:long=24.9419260025024 geo:lat=60.1587851399795</code>, for example. These two mechanisms make it easy to add GeoPress locations when using an offline blog client, or when posting by email or SMS.</p>
	  <h4>Limitations</h4>
	  <p>Currently, GeoPress only supports a single geographic coordinate. In the future it will support lines, polygons, and multiple points.</p>
	  <h3>Template Functions</h3>
	  <p>These functions are available from GeoPress to further customize embedding geographic information into your blog. The <strong>Post</strong> functions return information about a specific post, or entry, and should be placed within the <em>the_post()</em> section of your templates. <strong>General</strong> functions can be used anywhere in your blog template and will return information pertaining to all of your geographic locations (such as maps, lists, links to locations)</p>
	  <h4>General Functions</h4>
	  <p>The following functions <em>return</em> the output. This allows you to perform any processing on the return text that you may want. To finally place the result in your template, use <code>echo</code>. For example, to output the stored address: <code>&lt;?php echo the_address(); ?&gt;</code></p>
	  <ul>
	   <li><code>geopress_map(width, height, num_locs)</code>: returns a GeoPress map of the last <code>num_locs</code> number of locations. If no value is set for <code>num_locs</code>, then all locations are plotted. <em>caution</em>: plotting all locations could slow down/prevent people viewing your blog.</li>
	  </ul>
	  <h4>Post Functions</h4>
	  <ul>
	   <li><code>has_location()</code>: returns 'true' if the post has a location, 'false' if no location was set</li>
	   <li><code>geopress_post_map(width, height, controls)</code>: returns a GeoPress map of the current post's location. <code>width, height</code> sets the map size in pixels. <code>controls</code> is boolean if you want controls or no controls</li>
	   <li><code>the_coord()</code>: returns the coordinates for the post as an array, latitude, longitude</li>
	   <li><code>the_address()</code>: returns the address for the post</li>
	   <li><code>the_location_name()</code>: returns the saved name for the post's location</li>
	   <li><code>the_geo_mf()</code>: returns the coordinates of the post in <a href="http://microformats.org/wiki/geo" title="Microformats Wiki: geo">Microformat geo</a> format </li>
	   <li><code>the_adr_mf()</code>: returns the address of the post in <a href="http://microformats.org/wiki/adr" title="Microformats Wiki: adr">Microformat adr</a> format </li>
	   <li><code>the_loc_mf()</code>: returns the location name of the post in <a href="http://microformats.org/wiki/hcard" title="Microformats Wiki: hCard">Microformat hCard</a> format </li>
	  </ul>
	  <h4>Template Functions</h4>
	  <p>GeoPress provides the ability to view all the posts at a specific location by putting "location=#" in the url, where # is the id number of the location, or "location=savedname", where <code>savedname</code> is the the name of the location (e.g. Home or Trafalgar Square)</p>
	  <ul>
	   <li><code>geopress_location_name()</code>: prints out the name of the location if it is passed in by the url..</li>
	   <li><code>geopress_locations_list()</code>: prints out an unordered list of locations and links to display posts at that location.</li>
	  </ul>
	  <?php
	  echo '</div> <!-- wrap -->';
  

?>