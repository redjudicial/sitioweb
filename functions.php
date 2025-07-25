<?php
/**
 * Functions para Red Judicial
 * Filtros de menú y redirects según membresía
 */

// Filtro para menú dinámico según plan de membresía
add_filter('wp_nav_menu_objects', 'redjudicial_filter_menu_items', 10, 2);

function redjudicial_filter_menu_items($items, $menu) {
    // Solo aplicar filtro si el usuario está logueado
    if (!is_user_logged_in()) {
        return $items;
    }
    
    $user_id = get_current_user_id();
    $plan_actual = '';
    
    // Obtener plan actual del usuario
    $planes_activos = wc_memberships_get_user_active_memberships($user_id);
    if (!empty($planes_activos)) {
        $plan_actual = $planes_activos[0]->get_plan()->get_slug();
    }
    
    // Mapeo de elementos de menú y planes requeridos
    $menu_restrictions = [
        'agenda-judicial' => ['profesionales-starter', 'profesionales-premium', 'profesionales-elite'],
        'webinars-especializados' => ['profesionales-starter', 'profesionales-premium', 'profesionales-elite'],
        'base-semantica' => ['profesionales-premium', 'profesionales-elite'],
        'marketplace' => ['profesionales-elite'],
        'dashboard-centralizado' => ['profesionales-elite'],
        'simuladores-examenes' => ['estudiantes-plus'],
        'ranking-estudiantes' => ['estudiantes-plus'],
        'perfil-profesional' => ['profesionales-premium', 'profesionales-elite'],
        'contador-horas' => ['profesionales-premium', 'profesionales-elite'],
        'correo-redjudicial' => ['profesionales-premium', 'profesionales-elite']
    ];
    
    foreach ($items as $key => $item) {
        $menu_slug = sanitize_title($item->title);
        
        // Verificar si el elemento requiere restricción
        if (isset($menu_restrictions[$menu_slug])) {
            $planes_requeridos = $menu_restrictions[$menu_slug];
            $tiene_acceso = false;
            
            // Verificar si el usuario tiene acceso
            foreach ($planes_requeridos as $plan_requerido) {
                if (wc_memberships_is_user_active_member($user_id, $plan_requerido)) {
                    $tiene_acceso = true;
                    break;
                }
            }
            
            // Ocultar elemento si no tiene acceso
            if (!$tiene_acceso) {
                unset($items[$key]);
            }
        }
    }
    
    return $items;
}

// Redirect desde páginas restringidas
add_action('template_redirect', 'redjudicial_check_page_access');

function redjudicial_check_page_access() {
    // Solo verificar si el usuario está logueado
    if (!is_user_logged_in()) {
        return;
    }
    
    $user_id = get_current_user_id();
    $current_page = get_post();
    
    if (!$current_page) {
        return;
    }
    
    // Mapeo de páginas y planes requeridos
    $page_restrictions = [
        'agenda-judicial' => ['profesionales-starter', 'profesionales-premium', 'profesionales-elite'],
        'webinars-especializados' => ['profesionales-starter', 'profesionales-premium', 'profesionales-elite'],
        'base-semantica' => ['profesionales-premium', 'profesionales-elite'],
        'marketplace' => ['profesionales-elite'],
        'dashboard-centralizado' => ['profesionales-elite'],
        'simuladores-examenes' => ['estudiantes-plus'],
        'ranking-estudiantes' => ['estudiantes-plus'],
        'perfil-profesional-verificado' => ['profesionales-premium', 'profesionales-elite'],
        'contador-horas-trabajo' => ['profesionales-premium', 'profesionales-elite'],
        'correo-redjudicial' => ['profesionales-premium', 'profesionales-elite']
    ];
    
    $page_slug = $current_page->post_name;
    
    if (isset($page_restrictions[$page_slug])) {
        $planes_requeridos = $page_restrictions[$page_slug];
        $tiene_acceso = false;
        
        // Verificar si el usuario tiene acceso
        foreach ($planes_requeridos as $plan_requerido) {
            if (wc_memberships_is_user_active_member($user_id, $plan_requerido)) {
                $tiene_acceso = true;
                break;
            }
        }
        
        // Redirect si no tiene acceso
        if (!$tiene_acceso) {
            wp_redirect('/dashboard?access_denied=1');
            exit;
        }
    }
}

// Asignación automática de grupos BuddyBoss según plan
add_action('wc_memberships_user_membership_created', 'redjudicial_assign_buddyboss_group', 10, 2);

function redjudicial_assign_buddyboss_group($membership, $args) {
    // Verificar que BuddyBoss esté activo
    if (!function_exists('bp_is_active')) {
        return;
    }
    
    $user_id = $membership->get_user_id();
    $plan_slug = $membership->get_plan()->get_slug();
    
    // Mapeo de planes a grupos BuddyBoss
    $plan_groups = [
        'profesionales-gratuito' => 'Profesionales Gratuito',
        'profesionales-starter' => 'Profesionales Starter',
        'profesionales-premium' => 'Profesionales Premium',
        'profesionales-elite' => 'Profesionales Elite',
        'estudiantes-gratis' => 'Estudiantes Gratis',
        'estudiantes-plus' => 'Estudiantes Plus'
    ];
    
    if (isset($plan_groups[$plan_slug])) {
        $group_name = $plan_groups[$plan_slug];
        
        // Buscar el grupo por nombre
        $group = groups_get_group_by_name($group_name);
        
        if ($group) {
            // Agregar usuario al grupo
            groups_join_group($group->id, $user_id);
        } else {
            // Crear el grupo si no existe
            $group_id = groups_create_group([
                'name' => $group_name,
                'description' => "Grupo para miembros del plan {$group_name}",
                'status' => 'public'
            ]);
            
            if ($group_id) {
                groups_join_group($group_id, $user_id);
            }
        }
    }
}

// Función helper para verificar acceso a funcionalidad
function redjudicial_user_has_access($funcionalidad) {
    if (!is_user_logged_in()) {
        return false;
    }
    
    $user_id = get_current_user_id();
    
    // Mapeo de funcionalidades y planes requeridos
    $funcionalidades = [
        'agenda_judicial' => ['profesionales-starter', 'profesionales-premium', 'profesionales-elite'],
        'webinars_especializados' => ['profesionales-starter', 'profesionales-premium', 'profesionales-elite'],
        'base_semantica' => ['profesionales-premium', 'profesionales-elite'],
        'marketplace' => ['profesionales-elite'],
        'dashboard_centralizado' => ['profesionales-elite'],
        'simuladores_examenes' => ['estudiantes-plus'],
        'ranking_estudiantes' => ['estudiantes-plus'],
        'perfil_verificado' => ['profesionales-premium', 'profesionales-elite'],
        'contador_horas' => ['profesionales-premium', 'profesionales-elite'],
        'correo_institucional' => ['profesionales-premium', 'profesionales-elite']
    ];
    
    if (!isset($funcionalidades[$funcionalidad])) {
        return false;
    }
    
    $planes_requeridos = $funcionalidades[$funcionalidad];
    
    foreach ($planes_requeridos as $plan) {
        if (wc_memberships_is_user_active_member($user_id, $plan)) {
            return true;
        }
    }
    
    return false;
}

// Shortcode para mostrar contenido condicional
add_shortcode('redjudicial_access', 'redjudicial_access_shortcode');

function redjudicial_access_shortcode($atts, $content = null) {
    $atts = shortcode_atts([
        'funcionalidad' => '',
        'plan' => ''
    ], $atts);
    
    if (empty($atts['funcionalidad']) && empty($atts['plan'])) {
        return '';
    }
    
    $tiene_acceso = false;
    
    if (!empty($atts['funcionalidad'])) {
        $tiene_acceso = redjudicial_user_has_access($atts['funcionalidad']);
    } elseif (!empty($atts['plan'])) {
        $tiene_acceso = wc_memberships_is_user_active_member(get_current_user_id(), $atts['plan']);
    }
    
    if ($tiene_acceso) {
        return do_shortcode($content);
    }
    
    return '';
}

// Agregar estilos CSS para elementos bloqueados
add_action('wp_head', 'redjudicial_blocked_styles');

function redjudicial_blocked_styles() {
    ?>
    <style>
    .redjudicial-blocked {
        opacity: 0.6;
        filter: grayscale(50%);
        pointer-events: none;
        position: relative;
    }
    
    .redjudicial-blocked::after {
        content: "🔒 Contenido bloqueado";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        font-size: 0.9rem;
        z-index: 10;
    }
    
    .redjudicial-upgrade-cta {
        background: #10B981;
        color: white;
        padding: 1rem;
        border-radius: 5px;
        text-align: center;
        margin: 1rem 0;
    }
    
    .redjudicial-upgrade-cta a {
        color: white;
        text-decoration: underline;
        font-weight: bold;
    }
    </style>
    <?php
}

// Hook para limpiar grupos cuando expira membresía
add_action('wc_memberships_user_membership_status_changed', 'redjudicial_handle_membership_status_change', 10, 3);

function redjudicial_handle_membership_status_change($membership, $old_status, $new_status) {
    if ($new_status === 'expired' || $new_status === 'cancelled') {
        $user_id = $membership->get_user_id();
        $plan_slug = $membership->get_plan()->get_slug();
        
        // Remover usuario del grupo correspondiente
        $plan_groups = [
            'profesionales-gratuito' => 'Profesionales Gratuito',
            'profesionales-starter' => 'Profesionales Starter',
            'profesionales-premium' => 'Profesionales Premium',
            'profesionales-elite' => 'Profesionales Elite',
            'estudiantes-gratis' => 'Estudiantes Gratis',
            'estudiantes-plus' => 'Estudiantes Plus'
        ];
        
        if (isset($plan_groups[$plan_slug])) {
            $group_name = $plan_groups[$plan_slug];
            $group = groups_get_group_by_name($group_name);
            
            if ($group) {
                groups_leave_group($group->id, $user_id);
            }
        }
    }
}
?> 