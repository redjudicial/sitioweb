<?php
/**
 * Script de verificación completa del sistema Red Judicial
 * Verifica productos, membresías, dashboard y funcionalidades
 */

// Cargar WordPress
require_once('/Users/nicobarriga/Local Sites/red-judicial/app/public/wp-config.php');
require_once('/Users/nicobarriga/Local Sites/red-judicial/app/public/wp-load.php');

echo "🔍 VERIFICACIÓN COMPLETA DEL SISTEMA RED JUDICIAL\n";
echo "================================================\n\n";

// 1. VERIFICAR PLUGINS ACTIVOS
echo "📋 1. VERIFICACIÓN DE PLUGINS\n";
echo "-----------------------------\n";

$plugins_requeridos = [
    'WooCommerce' => 'woocommerce/woocommerce.php',
    'WooCommerce Subscriptions' => 'woocommerce-subscriptions/woocommerce-subscriptions.php',
    'WooCommerce Memberships' => 'woocommerce-memberships/woocommerce-memberships.php',
    'BuddyBoss' => 'buddyboss-platform/bp-loader.php'
];

foreach ($plugins_requeridos as $nombre => $plugin) {
    if (is_plugin_active($plugin)) {
        echo "✅ {$nombre}: ACTIVO\n";
    } else {
        echo "❌ {$nombre}: INACTIVO\n";
    }
}

echo "\n";

// 2. VERIFICAR PRODUCTOS WOOCOMMERCE
echo "📦 2. VERIFICACIÓN DE PRODUCTOS WOOCOMMERCE\n";
echo "------------------------------------------\n";

$productos_esperados = [
    'profesionales-gratuito',
    'profesionales-starter', 
    'profesionales-premium',
    'profesionales-elite',
    'estudiantes-gratis',
    'estudiantes-plus'
];

$productos_encontrados = 0;

foreach ($productos_esperados as $slug) {
    $producto = get_page_by_path($slug, OBJECT, 'product');
    if ($producto) {
        $producto_obj = wc_get_product($producto->ID);
        $precio = $producto_obj->get_price();
        $tipo = $producto_obj->get_type();
        
        echo "✅ {$slug}: {$tipo} - $" . number_format($precio, 0, ',', '.') . "\n";
        $productos_encontrados++;
    } else {
        echo "❌ {$slug}: NO ENCONTRADO\n";
    }
}

echo "📊 Productos encontrados: {$productos_encontrados}/6\n\n";

// 3. VERIFICAR PLANES DE MEMBRESÍA
echo "🏆 3. VERIFICACIÓN DE PLANES DE MEMBRESÍA\n";
echo "----------------------------------------\n";

$planes_encontrados = 0;

foreach ($productos_esperados as $slug) {
    $plan = get_page_by_path($slug, OBJECT, 'wc_membership_plan');
    if ($plan) {
        $membership_plan = wc_memberships_get_membership_plan($plan->ID);
        $descripcion = $membership_plan->get_description();
        
        echo "✅ {$slug}: " . substr($descripcion, 0, 50) . "...\n";
        $planes_encontrados++;
    } else {
        echo "❌ {$slug}: NO ENCONTRADO\n";
    }
}

echo "📊 Planes encontrados: {$planes_encontrados}/6\n\n";

// 4. VERIFICAR TEMPLATE DASHBOARD
echo "🎛️  4. VERIFICACIÓN DE TEMPLATE DASHBOARD\n";
echo "----------------------------------------\n";

$dashboard_template = get_template_directory() . '/dashboard-redjudicial.php';
if (file_exists($dashboard_template)) {
    echo "✅ Template dashboard-redjudicial.php: ENCONTRADO\n";
} else {
    echo "❌ Template dashboard-redjudicial.php: NO ENCONTRADO\n";
}

// Verificar si está registrado como template
$templates = get_page_templates();
$dashboard_registrado = false;

foreach ($templates as $template_name => $template_filename) {
    if ($template_filename === 'dashboard-redjudicial.php') {
        $dashboard_registrado = true;
        break;
    }
}

if ($dashboard_registrado) {
    echo "✅ Template registrado en WordPress\n";
} else {
    echo "⚠️  Template no registrado (puede ser normal)\n";
}

echo "\n";

// 5. VERIFICAR FUNCIONES PHP
echo "⚙️  5. VERIFICACIÓN DE FUNCIONES PHP\n";
echo "-----------------------------------\n";

$funciones_esperadas = [
    'redjudicial_filter_menu_items',
    'redjudicial_check_page_access',
    'redjudicial_assign_buddyboss_group',
    'redjudicial_user_has_access',
    'redjudicial_access_shortcode'
];

$funciones_encontradas = 0;

foreach ($funciones_esperadas as $funcion) {
    if (function_exists($funcion)) {
        echo "✅ {$funcion}: DISPONIBLE\n";
        $funciones_encontradas++;
    } else {
        echo "❌ {$funcion}: NO DISPONIBLE\n";
    }
}

echo "📊 Funciones encontradas: {$funciones_encontradas}/5\n\n";

// 6. VERIFICAR GRUPOS BUDDYBOSS
echo "👥 6. VERIFICACIÓN DE GRUPOS BUDDYBOSS\n";
echo "-------------------------------------\n";

if (function_exists('bp_is_active') && bp_is_active('groups')) {
    $grupos_esperados = [
        'Profesionales Gratuito',
        'Profesionales Starter',
        'Profesionales Premium', 
        'Profesionales Elite',
        'Estudiantes Gratis',
        'Estudiantes Plus'
    ];
    
    $grupos_encontrados = 0;
    
    foreach ($grupos_esperados as $nombre_grupo) {
        $grupo = groups_get_group_by_name($nombre_grupo);
        if ($grupo) {
            echo "✅ {$nombre_grupo}: ENCONTRADO\n";
            $grupos_encontrados++;
        } else {
            echo "❌ {$nombre_grupo}: NO ENCONTRADO\n";
        }
    }
    
    echo "📊 Grupos encontrados: {$grupos_encontrados}/6\n";
} else {
    echo "⚠️  BuddyBoss no está activo o grupos no están habilitados\n";
}

echo "\n";

// 7. VERIFICAR PÁGINAS REQUERIDAS
echo "📄 7. VERIFICACIÓN DE PÁGINAS REQUERIDAS\n";
echo "----------------------------------------\n";

$paginas_requeridas = [
    'foros-debates',
    'noticias',
    'webinars-generales',
    'agenda-judicial',
    'webinars-especializados',
    'base-semantica',
    'marketplace',
    'dashboard-centralizado',
    'simuladores-examenes',
    'ranking-estudiantes'
];

$paginas_encontradas = 0;

foreach ($paginas_requeridas as $slug) {
    $pagina = get_page_by_path($slug, OBJECT, 'page');
    if ($pagina) {
        echo "✅ {$slug}: ENCONTRADA\n";
        $paginas_encontradas++;
    } else {
        echo "❌ {$slug}: NO ENCONTRADA\n";
    }
}

echo "📊 Páginas encontradas: {$paginas_encontradas}/10\n\n";

// 8. VERIFICAR CONFIGURACIÓN DE SUSCRIPCIONES
echo "💳 8. VERIFICACIÓN DE SUSCRIPCIONES\n";
echo "----------------------------------\n";

if (class_exists('WC_Subscriptions')) {
    echo "✅ WooCommerce Subscriptions: ACTIVO\n";
    
    // Verificar productos de suscripción
    $productos_suscripcion = 0;
    foreach ($productos_esperados as $slug) {
        $producto = get_page_by_path($slug, OBJECT, 'product');
        if ($producto) {
            $producto_obj = wc_get_product($producto->ID);
            if ($producto_obj->get_type() === 'subscription') {
                $productos_suscripcion++;
            }
        }
    }
    
    echo "📊 Productos de suscripción: {$productos_suscripcion}/4\n";
} else {
    echo "❌ WooCommerce Subscriptions: NO ACTIVO\n";
}

echo "\n";

// 9. RESUMEN FINAL
echo "🎯 RESUMEN FINAL\n";
echo "================\n";

$total_checks = 0;
$passed_checks = 0;

// Contar verificaciones
$total_checks += count($plugins_requeridos);
$passed_checks += count(array_filter($plugins_requeridos, function($plugin) {
    return is_plugin_active($plugin);
}));

$total_checks += count($productos_esperados);
$passed_checks += $productos_encontrados;

$total_checks += count($productos_esperados);
$passed_checks += $planes_encontrados;

$total_checks += 2; // Dashboard template
$passed_checks += ($dashboard_registrado ? 1 : 0) + (file_exists($dashboard_template) ? 1 : 0);

$total_checks += count($funciones_esperadas);
$passed_checks += $funciones_encontradas;

$total_checks += count($paginas_requeridas);
$passed_checks += $paginas_encontradas;

$porcentaje_exito = round(($passed_checks / $total_checks) * 100, 1);

echo "📊 Total de verificaciones: {$total_checks}\n";
echo "✅ Verificaciones exitosas: {$passed_checks}\n";
echo "❌ Verificaciones fallidas: " . ($total_checks - $passed_checks) . "\n";
echo "🎯 Porcentaje de éxito: {$porcentaje_exito}%\n\n";

if ($porcentaje_exito >= 90) {
    echo "🎉 ¡SISTEMA IMPLEMENTADO EXITOSAMENTE!\n";
    echo "El sistema Red Judicial está funcionando correctamente.\n";
} elseif ($porcentaje_exito >= 70) {
    echo "⚠️  SISTEMA PARCIALMENTE IMPLEMENTADO\n";
    echo "Hay algunos elementos que requieren atención.\n";
} else {
    echo "❌ SISTEMA CON PROBLEMAS\n";
    echo "Se requiere revisión y corrección de varios elementos.\n";
}

echo "\n📋 PRÓXIMOS PASOS:\n";
echo "1. Crear páginas faltantes\n";
echo "2. Configurar menús de navegación\n";
echo "3. Probar flujo de compra y suscripciones\n";
echo "4. Configurar pasarela de pagos (Flow)\n";
echo "5. Realizar pruebas de usuario\n";
?> 