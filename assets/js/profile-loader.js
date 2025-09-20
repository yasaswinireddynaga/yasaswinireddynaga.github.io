/**
 * Profile Loader - Dynamically loads and renders profile data from JSON
 * This script fetches profile data and populates the HTML template
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        dataPath: 'data/profile.json',
        selectors: {
            // Header & Navigation
            siteLogo: '#header-logo',
            navMenu: '#nav-menu',
            navLinks: '#nav-links',
            
            // Banner/Hero Section
            profileName: '#profile-name',
            profileTitle: '#profile-title',
            profileImage: '#profile-image',
            profileIntro: '#profile-intro',
            profileBackground: '#profile-background',
            profileResearch: '#profile-research',
            cvButton: '#cv-button',
            
            // Publications
            publicationsGrid: '#publications-grid',
            
            // Projects
            projectsGrid: '#projects-grid',
            
            // Contact
            contactEmail: '#contact-email',
            contactLinks: '#contact-links',
            
            // Page
            pageTitle: 'title'
        }
    };

    /**
     * Main initialization function
     */
    async function init() {
        try {
            const data = await fetchProfileData();
            if (data) {
                renderProfile(data);
                console.log('Profile loaded successfully');
            }
        } catch (error) {
            console.error('Error initializing profile:', error);
            showError('Failed to load profile data');
        }
    }

    /**
     * Fetch profile data from JSON file
     */
    async function fetchProfileData() {
        try {
            const response = await fetch(CONFIG.dataPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching profile data:', error);
            return null;
        }
    }

    /**
     * Main render function that delegates to section renderers
     */
    function renderProfile(data) {
        renderPageMeta(data);
        renderHeader(data);
        renderBanner(data);
        renderPublications(data.publications);
        renderProjects(data.projects);
        renderSkills(data.skills);
        renderEducation(data);
        applyThemeColors(data.siteConfig);
    }

    /**
     * Render page metadata
     */
    function renderPageMeta(data) {
        if (data.profile && data.profile.name) {
            document.title = data.profile.name;
        }
    }

    /**
     * Render header section
     */
    function renderHeader(data) {
        // Logo/Name
        const logo = document.querySelector(CONFIG.selectors.siteLogo);
        if (logo && data.profile) {
            logo.innerHTML = `<strong>${data.profile.name}</strong>`;
        }

        // Navigation
        const navLinks = document.querySelector(CONFIG.selectors.navLinks);
        if (navLinks && data.navigation) {
            navLinks.innerHTML = '';
            data.navigation.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="${item.href}">${item.label}</a>`;
                navLinks.appendChild(li);
            });
        }

        // Contact links in header
        if (data.contact) {
            const contactLinks = navLinks || document.querySelector(CONFIG.selectors.navLinks);
            if (contactLinks) {
                if (data.contact.email) {
                    const emailLi = document.createElement('li');
                    emailLi.innerHTML = `<a href="mailto:${data.contact.email}">${data.contact.email}</a>`;
                    contactLinks.appendChild(emailLi);
                }
                if (data.contact.linkedin) {
                    const linkedinLi = document.createElement('li');
                    linkedinLi.innerHTML = `<a href="${data.contact.linkedin}" target="_blank" rel="noopener">LinkedIn</a>`;
                    contactLinks.appendChild(linkedinLi);
                }
                if (data.contact.github) {
                    const githubLi = document.createElement('li');
                    githubLi.innerHTML = `<a href="${data.contact.github}" target="_blank" rel="noopener">GitHub</a>`;
                    contactLinks.appendChild(githubLi);
                }
                if (data.contact.googleScholar) {
                    const scholarLi = document.createElement('li');
                    scholarLi.innerHTML = `<a href="${data.contact.googleScholar}" target="_blank" rel="noopener">Google Scholar</a>`;
                    contactLinks.appendChild(scholarLi);
                }
            }
        }
    }

    /**
     * Render banner/hero section
     */
    function renderBanner(data) {
        if (!data.profile) return;

        // Name
        const nameEl = document.querySelector(CONFIG.selectors.profileName);
        if (nameEl) {
            nameEl.textContent = data.profile.name;
        }

        // Title
        const titleEl = document.querySelector(CONFIG.selectors.profileTitle);
        if (titleEl) {
            titleEl.textContent = `${data.profile.title} | ${data.profile.organization}`;
        }

        // Profile Image
        const imageEl = document.querySelector(CONFIG.selectors.profileImage);
        if (imageEl && data.profile.profileImage) {
            imageEl.src = data.profile.profileImage;
            imageEl.alt = data.profile.name;
            // Performance hint
            try { imageEl.decoding = 'async'; } catch(e) {}
        }

        // Bio sections
        if (data.bio) {
            const introEl = document.querySelector(CONFIG.selectors.profileIntro);
            if (introEl && data.bio.introduction) {
                introEl.innerHTML = data.bio.introduction;
            }

            const bgEl = document.querySelector(CONFIG.selectors.profileBackground);
            if (bgEl && data.bio.background) {
                bgEl.innerHTML = data.bio.background;
            }

            const researchEl = document.querySelector(CONFIG.selectors.profileResearch);
            if (researchEl && data.bio.researchFocus) {
                researchEl.innerHTML = data.bio.researchFocus;
            }
        }

        // Hero Metrics
        const metricsEl = document.querySelector('#hero-metrics');
        if (metricsEl && data.profile.metrics) {
            metricsEl.innerHTML = data.profile.metrics.map(metric => {
                const parts = metric.split(' ');
                const value = parts[0];
                const label = parts.slice(1).join(' ');
                return `
                    <div class="metric-item">
                        <div class="metric-value">${value}</div>
                        <div class="metric-label">${label}</div>
                    </div>
                `;
            }).join('');
        }

        // CV Button
        const cvBtn = document.querySelector(CONFIG.selectors.cvButton);
        if (cvBtn && data.profile.cvPath) {
            cvBtn.href = data.profile.cvPath;
        }
    }

    /**
     * Render publications section
     */
    function renderPublications(publications) {
        const container = document.querySelector(CONFIG.selectors.publicationsGrid);
        if (!container || !publications) return;

        container.innerHTML = '';
        
        publications.forEach(pub => {
            const article = createPublicationCard(pub);
            container.appendChild(article);
        });
    }

    /**
     * Create a publication card element
     */
    function createPublicationCard(pub) {
        const article = document.createElement('article');
        article.className = 'publication-card';
        
        let linksHtml = '';
        if (pub.links) {
            if (pub.links.paper) {
                linksHtml += `<li><a href="${pub.links.paper}" class="button">Read Paper</a></li>`;
            } else if (pub.links.status) {
                linksHtml += `<li><a href="#" class="button">Paper (${pub.links.status})</a></li>`;
            }
            if (pub.links.github) {
                linksHtml += `<li><a href="${pub.links.github}" class="button">View Project</a></li>`;
            }
        }

        article.innerHTML = `
            <div class="image">
                <img src="${pub.image || 'images/pic01.jpg'}" alt="${pub.title}" loading="lazy" decoding="async" />
            </div>
            <div class="content">
                <h3>${pub.title}</h3>
                ${pub.authors ? `<p class="authors">${pub.authors}${pub.venue ? ', ' + pub.venue : ''}</p>` : ''}
                ${pub.venue && !pub.authors ? `<p class="authors">${pub.venue}</p>` : ''}
                <p class="description">${pub.description}</p>
                ${linksHtml ? `<ul class="actions">${linksHtml}</ul>` : ''}
            </div>
        `;
        
        return article;
    }

    /**
     * Render projects section with category filtering
     */
    function renderProjects(projects) {
        const container = document.querySelector(CONFIG.selectors.projectsGrid);
        if (!container || !projects) return;

        // Add category filter buttons
        const categoriesHtml = createCategoryFilter(projects);
        const filterContainer = document.createElement('div');
        filterContainer.className = 'project-filter-container';
        filterContainer.innerHTML = categoriesHtml;
        
        // Insert filter before projects grid
        const projectsSection = container.closest('section');
        const existingFilter = projectsSection.querySelector('.project-filter-container');
        if (existingFilter) {
            existingFilter.remove();
        }
        projectsSection.insertBefore(filterContainer, container);

        // Render all projects initially
        renderProjectsByCategory(projects, 'all');
        
        // Add event listeners for category filtering
        attachCategoryFilterListeners(projects);
    }

    /**
     * Create category filter buttons
     */
    function createCategoryFilter(projects) {
        const categories = [...new Set(projects.map(p => p.category))].filter(Boolean);
        
        return `
            <div class="project-categories">
                <button class="category-btn active" data-category="all">All Projects</button>
                ${categories.map(category => `
                    <button class="category-btn" data-category="${category}">
                        ${category === 'academic' ? 'Academic' : category === 'github' ? 'Portfolio' : category}
                    </button>
                `).join('')}
            </div>
        `;
    }

    /**
     * Render projects by category
     */
    function renderProjectsByCategory(projects, selectedCategory) {
        const container = document.querySelector(CONFIG.selectors.projectsGrid);
        if (!container) return;

        const filteredProjects = selectedCategory === 'all' 
            ? projects 
            : projects.filter(p => p.category === selectedCategory);

        container.innerHTML = '';
        
        filteredProjects.forEach(project => {
            const article = createExpandableProjectCard(project);
            container.appendChild(article);
        });
    }

    /**
     * Attach event listeners for category filtering
     */
    function attachCategoryFilterListeners(projects) {
        const categoryButtons = document.querySelectorAll('.category-btn');
        
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active button
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter and render projects
                const selectedCategory = this.dataset.category;
                renderProjectsByCategory(projects, selectedCategory);
            });
        });
    }

    /**
     * Create an expandable project card element
     */
    function createExpandableProjectCard(project) {
        const article = document.createElement('article');
        article.className = `project-card expandable-card ${project.category}-project`;
        article.dataset.projectId = project.id;
        // A11y: make card focusable and operable via keyboard
        article.setAttribute('tabindex', '0');
        article.setAttribute('role', 'button');
        article.setAttribute('aria-expanded', 'false');
        
        // Create collapsed view (default state)
        const collapsedView = createCollapsedProjectView(project);
        
        // Create expanded view (hidden by default)
        const expandedView = createExpandedProjectView(project);
        
        article.innerHTML = `
            <div class="card-content">
                ${collapsedView}
                ${expandedView}
            </div>
        `;
        
        // Make entire card clickable, but ignore clicks on interactive children (e.g., links)
        article.addEventListener('click', function(e) {
            const interactive = e.target.closest('a, button');
            if (interactive) return; // allow normal link/button behavior
            toggleProjectExpansion(article);
        });

        // Keyboard support: toggle on Enter/Space
        article.addEventListener('keydown', function(e) {
            const interactive = e.target.closest('a, button');
            if (interactive) return;
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleProjectExpansion(article);
            }
        });
        
        return article;
    }

    /**
     * Create collapsed project view - ultra minimal
     */
    function createCollapsedProjectView(project) {
        return `
            <div class="collapsed-content">
                <div class="project-header">
                    <h3 class="project-title">
                        ${project.title}
                        ${project.year ? `<span class="project-year">${project.year}</span>` : ''}
                        <span class="expand-indicator">•••</span>
                    </h3>
                </div>
                <p class="project-description">${project.shortDescription}</p>
            </div>
        `;
    }

    /**
     * Create expanded project view
     */
    function createExpandedProjectView(project) {
        // Complete metrics
        let fullMetricsHtml = '';
        if (project.metrics && project.metrics.length > 0) {
            fullMetricsHtml = `
                <div class="project-metrics expanded">
                    ${project.metrics.map(metric => `
                        <div class="metric-item" title="${metric.tooltip || ''}">
                            <div class="metric-value">${metric.value}</div>
                            <div class="metric-label">${metric.label}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // Complete tech stack
        let fullTechStackHtml = '';
        if (project.techStack && project.techStack.length > 0) {
            fullTechStackHtml = `
                <div class="tech-stack-expanded">
                    <h4>Technologies Used:</h4>
                    <div class="tech-pills expanded">
                        ${project.techStack.map(tech => 
                            `<span class="tech-pill">${tech}</span>`
                        ).join('')}
                    </div>
                </div>
            `;
        }

        // Project links
        let linksHtml = '';
        if (project.links) {
            const linkItems = [];
            if (project.links.github) {
                // Minimal inline GitHub icon (Octicons-style)
                linkItems.push(`
                <a href="${project.links.github}" target="_blank" rel="noopener" class="project-link github-link">
                  <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.79 8.2 11.39.6.11.82-.26.82-.58 0-.29-.01-1.07-.02-2.09-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.1-.76.08-.74.08-.74 1.22.09 1.86 1.25 1.86 1.25 1.08 1.85 2.83 1.32 3.52 1.01.11-.78.42-1.32.76-1.62-2.67-.3-5.47-1.34-5.47-5.98 0-1.32.47-2.39 1.25-3.24-.13-.3-.54-1.53.12-3.18 0 0 1.02-.33 3.34 1.24.97-.27 2-.41 3.03-.41s2.06.14 3.03.41c2.32-1.57 3.34-1.24 3.34-1.24.66 1.65.24 2.88.12 3.18.78.85 1.25 1.92 1.25 3.24 0 4.65-2.81 5.68-5.49 5.98.43.37.82 1.1.82 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.21.7.83.58C20.56 21.79 24 17.3 24 12 24 5.37 18.63 0 12 0z"/>
                  </svg>
                  <span>GitHub</span>
                </a>`);
            }
            if (project.links.website) {
                linkItems.push(`<a href="${project.links.website}" target="_blank" rel="noopener" class="project-link demo-link">
                    <span class="link-text">Live Demo</span>
                </a>`);
            }
            if (project.documentPath) {
                // Minimal download icon (outline)
                linkItems.push(`
                <a href="${project.documentPath}" target="_blank" class="project-link document-link" download>
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M12 3v10"/>
                    <path d="M8 11l4 4 4-4"/>
                    <path d="M5 21h14a2 2 0 0 0 2-2v-3H3v3a2 2 0 0 0 2 2z"/>
                  </svg>
                  <span>View Document</span>
                </a>`);
            }
            
            if (linkItems.length > 0) {
                linksHtml = `
                    <div class="project-links">
                        ${linkItems.join('')}
                    </div>
                `;
            }
        }

        return `
            <div class="expanded-content" style="display: none;">
                ${fullMetricsHtml}
                <div class="project-detailed-description">
                    ${project.detailedDescription || project.shortDescription}
                </div>
                ${fullTechStackHtml}
                ${linksHtml}
            </div>
        `;
    }

    /**
     * Toggle project card expansion
     */
    function toggleProjectExpansion(article) {
        const collapsedContent = article.querySelector('.collapsed-content');
        const expandedContent = article.querySelector('.expanded-content');
        
        const isExpanded = article.classList.contains('expanded');
        
        if (isExpanded) {
            // Collapse
            article.classList.remove('expanded');
            collapsedContent.style.display = 'block';
            expandedContent.style.display = 'none';
            article.setAttribute('aria-expanded', 'false');
        } else {
            // Expand
            article.classList.add('expanded');
            collapsedContent.style.display = 'none';
            expandedContent.style.display = 'block';
            article.setAttribute('aria-expanded', 'true');
            
            // Scroll to the card if it's not fully visible
            setTimeout(() => {
                const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                article.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'nearest' });
            }, 300);
        }
    }

    /**
     * Apply theme colors from configuration
     */

    function renderEducation(data) {
        const educationGrid = document.querySelector('#education-grid');
        if (!educationGrid || !data.education) return;

        educationGrid.innerHTML = data.education.map(edu => {
            // Simplify degree names
            let degree = edu.degree
                .replace('Diploma in ', '')
                .replace("Bachelor's in ", '')
                .replace("Master's in ", "Master's ");
            
            // Create logo element if logo exists
            const logoHtml = edu.logo ? `
                <div class="education-logo">
                    <img src="${edu.logo}" alt="${edu.institution} logo" loading="lazy" decoding="async" />
                </div>
            ` : '';
            
            return `
                <div class="education-item">
                    ${logoHtml}
                    <div class="education-content">
                        <div class="edu-degree">${degree}</div>
                        <div class="edu-institution">${edu.institution}, ${edu.location}</div>
                        <div class="edu-year">${edu.year}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Render skills section
     */
    function renderSkills(skills) {
        const container = document.querySelector('#skills-container');
        if (!container || !skills) return;

        const categories = getSkillsCategories();
        const VISIBLE_COUNT = 6; // reduce visible items per category

        container.innerHTML = categories.map(cat => {
            const list = skills[cat.key];
            if (!list || list.length === 0) return '';

            const visible = list.slice(0, VISIBLE_COUNT);

            return `
                <div class="skills-category" data-key="${cat.key}">
                    <div class="skills-header">
                        <div class="skills-header-left">
                            <div class="skills-icon" aria-hidden="true">${getCategoryIcon(cat.key)}</div>
                            <h4>${cat.label}</h4>
                        </div>
                    </div>
                    <div id="skills-${cat.key}" class="skills-list">
                        ${visible.map(skill => `<span class="skill-item">${skill}</span>`).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    function getSkillsCategories() {
        return [
            { key: 'businessAnalysis', label: 'Business Analysis' },
            { key: 'dataAnalysisVisualization', label: 'Data Analysis & Visualization' },
            { key: 'toolsTechnologies', label: 'Tools & Technologies' },
            { key: 'documentationReporting', label: 'Documentation & Reporting' },
            { key: 'softwareDevelopmentQA', label: 'Software Development & QA' },
            { key: 'processWorkflowImprovement', label: 'Process & Workflow Improvement' },
            { key: 'softSkills', label: 'Professional Skills' }
        ];
    }

    function attachSkillsToggleListeners() {
        document.querySelectorAll('.skills-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const header = btn.closest('.skills-category');
                const list = header.querySelector('.skills-list');
                const hiddenItems = list.querySelectorAll('.skill-item.hidden');
                const collapsed = header.getAttribute('data-collapsed') === 'true';

                if (collapsed) {
                    hiddenItems.forEach(el => el.classList.remove('hidden'));
                    header.setAttribute('data-collapsed', 'false');
                    btn.textContent = 'Show less';
                    btn.setAttribute('aria-expanded', 'true');
                } else {
                    hiddenItems.forEach(el => el.classList.add('hidden'));
                    header.setAttribute('data-collapsed', 'true');
                    btn.textContent = 'Show more';
                    btn.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // Minimal, crisp inline SVG icons for each category
    function getCategoryIcon(key) {
        const svgProps = 'width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
        const icons = {
            businessAnalysis: `<svg ${svgProps}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><rect x="7" y="7" width="3" height="9"/><rect x="14" y="7" width="3" height="5"/></svg>`,
            dataAnalysisVisualization: `<svg ${svgProps}><rect x="3" y="10" width="4" height="10"/><rect x="10" y="6" width="4" height="14"/><rect x="17" y="3" width="4" height="17"/></svg>`,
            toolsTechnologies: `<svg ${svgProps}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
            documentationReporting: `<svg ${svgProps}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>`,
            softwareDevelopmentQA: `<svg ${svgProps}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><path d="M12 2l-2 20"/></svg>`,
            processWorkflowImprovement: `<svg ${svgProps}><path d="M23 7l-7 5 7 5V7z"/><path d="M1 7l7 5-7 5V7z"/><path d="M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14z"/></svg>`,
            softSkills: `<svg ${svgProps}><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>`
        };
        return icons[key] || `<svg ${svgProps}><circle cx="12" cy="12" r="9"/></svg>`;
    }

    function applyThemeColors(config) {
        if (!config || !config.themeColors) return;

        const root = document.documentElement;
        const colors = config.themeColors;

        // Preserve legacy variables (for any remaining references)
        if (colors.primaryRed) root.style.setProperty('--primary-red', colors.primaryRed);
        if (colors.lightRed) root.style.setProperty('--light-red', colors.lightRed);
        if (colors.darkRed) root.style.setProperty('--dark-red', colors.darkRed);
        if (colors.textDark) root.style.setProperty('--text-dark', colors.textDark);
        if (colors.textLight) root.style.setProperty('--text-light', colors.textLight);
        if (colors.bgLight) root.style.setProperty('--bg-light', colors.bgLight);
        if (colors.white) root.style.setProperty('--white', colors.white);

        // Map legacy theme to new minimal palette
        if (colors.textDark) root.style.setProperty('--text-primary', colors.textDark);
        if (colors.textLight) {
            root.style.setProperty('--text-secondary', colors.textLight);
            root.style.setProperty('--text-tertiary', colors.textLight);
        }
        if (colors.primaryRed) root.style.setProperty('--accent', colors.primaryRed);
        if (colors.white) root.style.setProperty('--bg-primary', colors.white);
        if (colors.bgLight) {
            root.style.setProperty('--bg-secondary', colors.bgLight);
            root.style.setProperty('--bg-tertiary', colors.bgLight);
        }
        // Border variables remain neutral defaults (defined in CSS)
    }

    /**
     * Show error message
     */
    function showError(message) {
        console.error(message);
        // Could implement a user-facing error display here
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
