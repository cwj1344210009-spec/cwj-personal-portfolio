/**
 * 蔡文杰个人作品集网站 - 主交互脚本
 * 功能：导航栏交互、平滑滚动、入场动画、移动端菜单
 */

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
  // 初始化 Lucide 图标
  lucide.createIcons();

  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initScrollAnimations();
  initPortfolioFilters();
});

// ==================== 导航栏滚动效果 ====================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // 滚动超过50px时添加背景
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

// ==================== 移动端汉堡菜单 ====================
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  let isOpen = false;

  menuToggle.addEventListener('click', () => {
    isOpen = !isOpen;

    // 切换按钮动画
    menuToggle.classList.toggle('active', isOpen);

    // 切换菜单显示
    if (isOpen) {
      mobileMenu.classList.remove('hidden');
      // 触发动画
      requestAnimationFrame(() => {
        mobileMenu.querySelector('.glass-card').style.opacity = '0';
        mobileMenu.querySelector('.glass-card').style.transform = 'translateY(-10px)';
        requestAnimationFrame(() => {
          mobileMenu.querySelector('.glass-card').style.transition = 'all 0.3s ease';
          mobileMenu.querySelector('.glass-card').style.opacity = '1';
          mobileMenu.querySelector('.glass-card').style.transform = 'translateY(0)';
        });
      });
    } else {
      mobileMenu.querySelector('.glass-card').style.opacity = '0';
      mobileMenu.querySelector('.glass-card').style.transform = 'translateY(-10px)';
      setTimeout(() => {
        mobileMenu.classList.add('hidden');
      }, 300);
    }
  });

  // 点击菜单链接后关闭菜单
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      isOpen = false;
      menuToggle.classList.remove('active');
      mobileMenu.querySelector('.glass-card').style.opacity = '0';
      mobileMenu.querySelector('.glass-card').style.transform = 'translateY(-10px)';
      setTimeout(() => {
        mobileMenu.classList.add('hidden');
      }, 300);
    });
  });

  // 点击页面其他区域关闭菜单
  document.addEventListener('click', (e) => {
    if (isOpen && !menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
      isOpen = false;
      menuToggle.classList.remove('active');
      mobileMenu.querySelector('.glass-card').style.opacity = '0';
      mobileMenu.querySelector('.glass-card').style.transform = 'translateY(-10px)';
      setTimeout(() => {
        mobileMenu.classList.add('hidden');
      }, 300);
    }
  });
}

// ==================== 平滑滚动 ====================
function initSmoothScroll() {
  // 所有锚点链接平滑滚动
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const navbarHeight = document.getElementById('navbar').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ==================== 滚动入场动画 ====================
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 获取动画延迟
        const delay = entry.target.style.animationDelay || '0s';
        const delayMs = parseFloat(delay) * 1000;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delayMs);

        // 只触发一次
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // 观察所有需要动画的元素
  document.querySelectorAll('.fade-in-up').forEach(el => {
    observer.observe(el);
  });
}

// ==================== 作品集筛选 ====================
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  if (!filterBtns.length || !portfolioCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 切换活跃按钮
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          card.classList.remove('hidden-card');
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 400);
        }
      });
    });
  });
}
