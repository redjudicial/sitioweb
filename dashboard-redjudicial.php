<?php
/**
 * Template: Dashboard Red Judicial
 * Dashboard único con lógica condicional para 6 planes
 */

get_header(); ?>

<div class="dashboard-redjudicial">
    <div class="container">
        
        <!-- Header del Dashboard -->
        <div class="dashboard-header">
            <h1>Dashboard Red Judicial</h1>
            <p>Bienvenido, <?php echo wp_get_current_user()->display_name; ?></p>
            
            <?php
            // Obtener el plan actual del usuario
            $user_id = get_current_user_id();
            $plan_actual = '';
            $plan_categoria = '';
            
            // Verificar planes de membresía activos
            $planes_activos = wc_memberships_get_user_active_memberships($user_id);
            
            if (!empty($planes_activos)) {
                $plan = $planes_activos[0];
                $plan_actual = $plan->get_plan()->get_slug();
                $plan_categoria = get_post_meta($plan->get_plan()->get_id(), '_plan_categoria', true);
            }
            
            if ($plan_actual) {
                echo "<div class='plan-info'>";
                echo "<span class='plan-badge'>Plan: " . ucfirst(str_replace('-', ' ', $plan_actual)) . "</span>";
                echo "</div>";
            }
            ?>
        </div>

        <!-- Grid de Shortcuts -->
        <div class="shortcuts-grid">
            
            <!-- SHORTCUTS BÁSICOS (Todos los planes) -->
            
            <!-- Foros y Debates -->
            <div class="shortcut-card <?php echo wc_memberships_is_user_active_member($user_id, 'profesionales-gratuito') || wc_memberships_is_user_active_member($user_id, 'estudiantes-gratis') ? 'active' : 'blocked'; ?>">
                <div class="shortcut-icon">
                    <i class="fas fa-comments"></i>
                </div>
                <h3>Foros y Debates</h3>
                <p>Participa en discusiones jurídicas</p>
                <?php if (wc_memberships_is_user_active_member($user_id, 'profesionales-gratuito') || wc_memberships_is_user_active_member($user_id, 'estudiantes-gratis')): ?>
                    <a href="/foros-debates" class="btn-shortcut">Acceder</a>
                <?php else: ?>
                    <div class="blocked-overlay">
                        <span class="upgrade-text">Mejorar plan</span>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Noticias -->
            <div class="shortcut-card <?php echo wc_memberships_is_user_active_member($user_id, 'profesionales-gratuito') || wc_memberships_is_user_active_member($user_id, 'estudiantes-gratis') ? 'active' : 'blocked'; ?>">
                <div class="shortcut-icon">
                    <i class="fas fa-newspaper"></i>
                </div>
                <h3>Noticias</h3>
                <p>Actualidad jurídica nacional</p>
                <?php if (wc_memberships_is_user_active_member($user_id, 'profesionales-gratuito') || wc_memberships_is_user_active_member($user_id, 'estudiantes-gratis')): ?>
                    <a href="/noticias" class="btn-shortcut">Acceder</a>
                <?php else: ?>
                    <div class="blocked-overlay">
                        <span class="upgrade-text">Mejorar plan</span>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Webinars Generales -->
            <div class="shortcut-card <?php echo wc_memberships_is_user_active_member($user_id, 'profesionales-gratuito') || wc_memberships_is_user_active_member($user_id, 'estudiantes-gratis') ? 'active' : 'blocked'; ?>">
                <div class="shortcut-icon">
                    <i class="fas fa-video"></i>
                </div>
                <h3>Webinars Generales</h3>
                <p>Clases y charlas abiertas</p>
                <?php if (wc_memberships_is_user_active_member($user_id, 'profesionales-gratuito') || wc_memberships_is_user_active_member($user_id, 'estudiantes-gratis')): ?>
                    <a href="/webinars-generales" class="btn-shortcut">Acceder</a>
                <?php else: ?>
                    <div class="blocked-overlay">
                        <span class="upgrade-text">Mejorar plan</span>
                    </div>
                <?php endif; ?>
            </div>

            <!-- SHORTCUTS PROFESIONALES -->
            
            <!-- Agenda Judicial -->
            <div class="shortcut-card <?php echo wc_memberships_is_user_active_member($user_id, 'profesionales-starter') || wc_memberships_is_user_active_member($user_id, 'profesionales-premium') || wc_memberships_is_user_active_member($user_id, 'profesionales-elite') ? 'active' : 'blocked'; ?>">
                <div class="shortcut-icon">
                    <i class="fas fa-calendar-alt"></i>
                </div>
                <h3>Agenda Judicial</h3>
                <p>Gestiona audiencias y plazos</p>
                <?php if (wc_memberships_is_user_active_member($user_id, 'profesionales-starter') || wc_memberships_is_user_active_member($user_id, 'profesionales-premium') || wc_memberships_is_user_active_member($user_id, 'profesionales-elite')): ?>
                    <a href="/agenda-judicial" class="btn-shortcut">Acceder</a>
                <?php else: ?>
                    <div class="blocked-overlay">
                        <span class="upgrade-text">Plan Starter+</span>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Webinars Especializados -->
            <div class="shortcut-card <?php echo wc_memberships_is_user_active_member($user_id, 'profesionales-starter') || wc_memberships_is_user_active_member($user_id, 'profesionales-premium') || wc_memberships_is_user_active_member($user_id, 'profesionales-elite') ? 'active' : 'blocked'; ?>">
                <div class="shortcut-icon">
                    <i class="fas fa-chalkboard-teacher"></i>
                </div>
                <h3>Webinars Especializados</h3>
                <p>Seminarios técnicos por expertos</p>
                <?php if (wc_memberships_is_user_active_member($user_id, 'profesionales-starter') || wc_memberships_is_user_active_member($user_id, 'profesionales-premium') || wc_memberships_is_user_active_member($user_id, 'profesionales-elite')): ?>
                    <a href="/webinars-especializados" class="btn-shortcut">Acceder</a>
                <?php else: ?>
                    <div class="blocked-overlay">
                        <span class="upgrade-text">Plan Starter+</span>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Base Semántica -->
            <div class="shortcut-card <?php echo wc_memberships_is_user_active_member($user_id, 'profesionales-premium') || wc_memberships_is_user_active_member($user_id, 'profesionales-elite') ? 'active' : 'blocked'; ?>">
                <div class="shortcut-icon">
                    <i class="fas fa-brain"></i>
                </div>
                <h3>Base Semántica</h3>
                <p>Motor de búsqueda jurídica razonada</p>
                <?php if (wc_memberships_is_user_active_member($user_id, 'profesionales-premium') || wc_memberships_is_user_active_member($user_id, 'profesionales-elite')): ?>
                    <a href="/base-semantica" class="btn-shortcut">Acceder</a>
                <?php else: ?>
                    <div class="blocked-overlay">
                        <span class="upgrade-text">Plan Premium+</span>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Marketplace -->
            <div class="shortcut-card <?php echo wc_memberships_is_user_active_member($user_id, 'profesionales-elite') ? 'active' : 'blocked'; ?>">
                <div class="shortcut-icon">
                    <i class="fas fa-store"></i>
                </div>
                <h3>Marketplace</h3>
                <p>Publica o busca servicios legales</p>
                <?php if (wc_memberships_is_user_active_member($user_id, 'profesionales-elite')): ?>
                    <a href="/marketplace" class="btn-shortcut">Acceder</a>
                <?php else: ?>
                    <div class="blocked-overlay">
                        <span class="upgrade-text">Plan Elite</span>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Dashboard Centralizado -->
            <div class="shortcut-card <?php echo wc_memberships_is_user_active_member($user_id, 'profesionales-elite') ? 'active' : 'blocked'; ?>">
                <div class="shortcut-icon">
                    <i class="fas fa-tachometer-alt"></i>
                </div>
                <h3>Dashboard Centralizado</h3>
                <p>Panel con métricas y accesos rápidos</p>
                <?php if (wc_memberships_is_user_active_member($user_id, 'profesionales-elite')): ?>
                    <a href="/dashboard-centralizado" class="btn-shortcut">Acceder</a>
                <?php else: ?>
                    <div class="blocked-overlay">
                        <span class="upgrade-text">Plan Elite</span>
                    </div>
                <?php endif; ?>
            </div>

            <!-- SHORTCUTS ESTUDIANTES -->
            
            <!-- Simuladores de Exámenes -->
            <div class="shortcut-card <?php echo wc_memberships_is_user_active_member($user_id, 'estudiantes-plus') ? 'active' : 'blocked'; ?>">
                <div class="shortcut-icon">
                    <i class="fas fa-file-alt"></i>
                </div>
                <h3>Simuladores de Exámenes</h3>
                <p>Practica con exámenes reales</p>
                <?php if (wc_memberships_is_user_active_member($user_id, 'estudiantes-plus')): ?>
                    <a href="/simuladores-examenes" class="btn-shortcut">Acceder</a>
                <?php else: ?>
                    <div class="blocked-overlay">
                        <span class="upgrade-text">Plan Plus</span>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Ranking de Estudiantes -->
            <div class="shortcut-card <?php echo wc_memberships_is_user_active_member($user_id, 'estudiantes-plus') ? 'active' : 'blocked'; ?>">
                <div class="shortcut-icon">
                    <i class="fas fa-trophy"></i>
                </div>
                <h3>Ranking de Estudiantes</h3>
                <p>Destaca tu talento</p>
                <?php if (wc_memberships_is_user_active_member($user_id, 'estudiantes-plus')): ?>
                    <a href="/ranking-estudiantes" class="btn-shortcut">Acceder</a>
                <?php else: ?>
                    <div class="blocked-overlay">
                        <span class="upgrade-text">Plan Plus</span>
                    </div>
                <?php endif; ?>
            </div>

        </div>

        <!-- Sección de Upgrade -->
        <?php if (!$plan_actual || $plan_actual === 'profesionales-gratuito' || $plan_actual === 'estudiantes-gratis'): ?>
        <div class="upgrade-section">
            <h2>¿Quieres acceder a más funcionalidades?</h2>
            <p>Mejora tu plan y desbloquea herramientas avanzadas</p>
            <a href="/planes" class="btn-upgrade">Ver Planes</a>
        </div>
        <?php endif; ?>

    </div>
</div>

<style>
.dashboard-redjudicial {
    padding: 2rem 0;
    background: #f8f9fa;
    min-height: 100vh;
}

.dashboard-header {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.plan-info {
    margin-top: 1rem;
}

.plan-badge {
    background: #4F46E5;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: bold;
}

.shortcuts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
}

.shortcut-card {
    background: white;
    border-radius: 10px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.shortcut-card.active {
    border: 2px solid #4F46E5;
}

.shortcut-card.blocked {
    opacity: 0.6;
    filter: grayscale(50%);
}

.shortcut-icon {
    font-size: 3rem;
    color: #4F46E5;
    margin-bottom: 1rem;
}

.shortcut-card h3 {
    margin-bottom: 0.5rem;
    color: #333;
}

.shortcut-card p {
    color: #666;
    margin-bottom: 1.5rem;
}

.btn-shortcut {
    background: #4F46E5;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 5px;
    text-decoration: none;
    display: inline-block;
    transition: background 0.3s ease;
}

.btn-shortcut:hover {
    background: #3730A3;
    color: white;
}

.blocked-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
}

.upgrade-text {
    color: white;
    font-weight: bold;
    background: #EF4444;
    padding: 0.5rem 1rem;
    border-radius: 5px;
}

.upgrade-section {
    text-align: center;
    padding: 3rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.btn-upgrade {
    background: #10B981;
    color: white;
    padding: 1rem 2rem;
    border-radius: 5px;
    text-decoration: none;
    font-weight: bold;
    display: inline-block;
    margin-top: 1rem;
    transition: background 0.3s ease;
}

.btn-upgrade:hover {
    background: #059669;
    color: white;
}
</style>

<?php get_footer(); ?> 