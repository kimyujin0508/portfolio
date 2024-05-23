$(function () {
  // AOS
  AOS.init();

  // =========== header 영역 ============
  // header fixed
  var win = $(window);
  win.scroll(function () {
    if ($(this).scrollTop() > 0) {
      $("header").addClass("fixed");
    } else {
      $("header").removeClass("fixed");
    }
  });

  // 메뉴 열기
  $(".menu-btn").click(() => {
    $(".menu-btn").toggleClass("close");
    $(".menu").toggleClass("open");
    $("body").toggleClass("dimmed");
  });

  // 영역 선택 시 메뉴 닫기
  $(".menu > div > ul > li a").click((e) => {
    $(".menu-btn").toggleClass("close");
    $(".menu").toggleClass("open");
    $("body").toggleClass("dimmed");
  });

  // =========== main 영역 ============
  // home영역 GSAP
  const intro = gsap.timeline();
  intro
    .addLabel("a")
    .from(
      "#home .title01",
      { autoAlpha: 0, x: -180, duration: 1.25, delay: 0.5 },
      "a"
    )
    .from(
      "#home .title02",
      { autoAlpha: 0, x: 180, delay: 0.5, duration: 1.25 },
      "a"
    )
    .from(
      "#home .title03",
      { autoAlpha: 0, x: -180, delay: 0.5, duration: 1.25 },
      "a"
    )
    .from("#home p", { autoAlpha: 0, y: 90, delay: 1, duration: 1 }, "a")
    .from(
      "#home .objet01",
      { rotate: 360, autoAlpha: 0, duration: 0.3, delay: 1.3 },
      "a"
    )
    .from(
      "#home .objet02",
      { rotate: 360, autoAlpha: 0, duration: 0.3, delay: 1.5 },
      "a"
    );

  // =========== about 영역 ============
  // 배경 애니메이션
  let scene, camera, renderer, ribbon;
  const container = document.querySelector("#canvas");
  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 10000);
    camera.position.z = 2;
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    container.appendChild(renderer.domElement);
    ribbon = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1, 128, 128),
      new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 1.0 },
        },
        vertexShader: `
        varying vec3 vEC;
        uniform float time;

        float iqhash(float n) {
          return fract(sin(n) * 43758.5453);
        }
        float noise(vec3 x) {
          vec3 p = floor(x);
          vec3 f = fract(x);
          f = f * f * (3.0 - 2.0 * f);
          float n = p.x + p.y * 57.0 + 113.0 * p.z;
          return mix(mix(mix(iqhash(n), iqhash(n + 1.0), f.x),
                     mix(iqhash(n + 57.0), iqhash(n + 58.0), f.x), f.y),
                     mix(mix(iqhash(n + 113.0), iqhash(n + 114.0), f.x),
                     mix(iqhash(n + 170.0), iqhash(n + 171.0), f.x), f.y), f.z);
        }
        float xmb_noise2(vec3 x) {
          return cos(x.z * 4.0) * cos(x.z + time / 10.0 + x.x);
        }
        void main() {
          vec4 pos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vec3 v = vec3(pos.x, 0.0, pos.y);
          vec3 v2 = v;
          vec3 v3 = v;
          v.y = xmb_noise2(v2) / 8.0;
          v3.x -= time / 5.0;
          v3.x /= 4.0;
          v3.z -= time / 10.0;
          v3.y -= time / 100.0;
          v.z -= noise(v3 * 7.0) / 15.0;
          v.y -= noise(v3 * 7.0) / 15.0 + cos(v.x * 2.0 - time / 2.0) / 5.0 - 0.3;
          vEC = v;
          gl_Position = vec4(v, 1.0);
        }
      `,
        fragmentShader: `
        uniform float time;
        varying vec3 vEC;
        void main()
        {
           const vec3 up = vec3(0.0, 0.0, 1.0);
           vec3 x = dFdx(vEC);
           vec3 y = dFdy(vEC);
           vec3 normal = normalize(cross(x, y));
           float c = 1.0 - dot(normal, up);
           c = (1.0 - cos(c * c)) / 3.0;
           gl_FragColor = vec4(1.0, 1.0, 1.0, c * 1.5);
        }
      `,
        extensions: {
          derivatives: true,
          fragDepth: false,
          drawBuffers: false,
          shaderTextureLOD: false,
        },
        side: THREE.DoubleSide,
        transparent: true,
        depthTest: false,
      })
    );
    scene.add(ribbon);
    resize();
    window.addEventListener("resize", resize);
  };

  const resize = () => {
    const { offsetWidth, offsetHeight } = container;
    renderer.setSize(offsetWidth, offsetHeight);
    renderer.setPixelRatio(devicePixelRatio);
    camera.aspect = offsetWidth / offsetHeight;
    camera.updateProjectionMatrix();
    ribbon.scale.set(camera.aspect * 1.55, 0.75, 1);
  };
  const animate = () => {
    ribbon.material.uniforms.time.value += 0.01;
    renderer.render(scene, camera);
    requestAnimationFrame(() => animate());
  };

  init();
  animate();

  // progressbar
  function progressbar(id, percent) {
    var bar = new ProgressBar.Line(id, {
      strokeWidth: 7,
      easing: "easeInOut",
      duration: 1400,
      color: "#eb5e28",
      trailColor: "#999",
      trailWidth: 20,
      svgStyle: { width: "75%", height: "100%", borderRadius: "20px" },
    });
    $(window).scroll(function () {
      if ($(window).scrollTop() >= $(".skill").scrollTop()) {
        bar.animate(percent);
      }
    });
  }
  progressbar(html, 0.9);
  progressbar(css, 0.8);
  progressbar(js, 0.7);
  progressbar(ps, 0.8);
  progressbar(ai, 0.8);
  progressbar(figma, 0.8);

  // =========== work 영역 ============
  const work = $(".web-work");

  work.click(function () {
    let idx = $(this).index();
    work.removeClass("active");
    let temp = $(this).hasClass("active");
    if (!temp) {
      $(this).addClass("active");
    }
  });

  // process01 모달창
  $(".view-work .process01").click(function (e) {
    e.preventDefault();
    $("#work-modal-mask").fadeIn();
    $("#work-modal").slideDown();
    $("#work-modal img").attr("src", `./images/process01.jpg`);
    $(".work-modal-close").fadeIn();
    $("html, body").css("overflow", "hidden");
  });
  $("#work-modal-mask, .work-modal-close").click(function () {
    $("#work-modal-mask").fadeOut();
    $("#work-modal").slideUp();
    $(".work-modal-close").fadeOut();
    $("html, body").css("overflow", "visible");
    $("#work-modal").scrollTop(0);
  });
  // process03 모달창
  $(".view-work .process03").click(function (e) {
    e.preventDefault();
    $("#work-modal-mask").fadeIn();
    $("#work-modal").slideDown();
    $("#work-modal img").attr("src", `./images/process03.jpg`);
    $(".work-modal-close").fadeIn();
    $("html, body").css("overflow", "hidden");
  });
  $("#work-modal-mask, .work-modal-close").click(function () {
    $("#work-modal-mask").fadeOut();
    $("#work-modal").slideUp();
    $(".work-modal-close").fadeOut();
    $("html, body").css("overflow", "visible");
    $("#work-modal").scrollTop(0);
  });

  // =========== design 영역 ============
  // design영역 GSAP
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.matchMedia({
    "(min-width: 1025px)": function () {
      const horSection = gsap.utils.toArray(".parallax-item");

      gsap.to(horSection, {
        xPercent: -120 * (horSection.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: ".parallax-wrap",
          start: "top 100px",
          end: "+=1500",
          pin: true,
          scrub: 1,
          markers: false,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    },
  });

  // design 모달창
  $("#design .parallax-item").click(function () {
    let i = $(this).index();
    $("#design-modal-mask").fadeIn();
    $("#design-modal").slideDown();
    $("#design-modal img").attr("src", `./images/design-work${i + 1}.jpg`);
    $(".design-modal-close").fadeIn();
    $("html, body").css("overflow", "hidden");
  });
  $("#design-modal-mask, .design-modal-close").click(function () {
    $("#design-modal-mask").fadeOut();
    $("#design-modal").slideUp();
    $(".design-modal-close").fadeOut();
    $("html, body").css("overflow", "visible");
    $("#design-modal").scrollTop(0);
  });

  // =========== contact 영역 ============
  // Typed
  var typed = new Typed("#animatingStr", {
    strings: [
      "금속과 같이 녹슬지 않는, 시간이 지나도 변하지 않는 가치를 지닌 사람이 되고자 합니다.",
    ],
    typeSpeed: 80,
    backSpeed: 50,
    smartBackspace: true,
    backDelay: 2000,
    loop: true,
  });

  // gotop 버튼
  $(".gotop").click(function (e) {
    e.preventDefault;
    $("html").animate(
      {
        scrollTop: 0,
      },
      500
    );
  });
});
