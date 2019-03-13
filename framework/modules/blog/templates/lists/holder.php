<div class="mkd-grid-row <?php echo esc_attr($holder_classes); ?>">
	<div <?php echo depot_mikado_get_content_sidebar_class(); ?>>
		<?php depot_mikado_get_blog_type($blog_type); ?>
	</div>
	<?php if($sidebar_layout !== 'no-sidebar') { ?>
		<div <?php echo depot_mikado_get_sidebar_holder_class(); ?>>
			<?php get_sidebar(); ?>
		</div>
	<?php } ?>
</div>