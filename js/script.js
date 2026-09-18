/* =========================================
   MOBILE NAVIGATION
   ========================================= */

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        const isOpen = navLinks.classList.toggle("active");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );

    });


    navLinks.querySelectorAll("a").forEach((link) => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

        });

    });

}


/* =========================================
   ACTIVE NAVIGATION
   ========================================= */

const sections = document.querySelectorAll(
    "main section[id]"
);

const navItems = document.querySelectorAll(
    ".nav-links a"
);

function updateActiveNav() {

    let currentSection = "";

    sections.forEach((section) => {

        const sectionTop =
            section.offsetTop - 120;

        if (window.scrollY >= sectionTop) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navItems.forEach((link) => {

        const href =
            link.getAttribute("href");

        link.classList.toggle(
            "active",
            href === `#${currentSection}`
        );

    });

}

window.addEventListener(
    "scroll",
    updateActiveNav
);

updateActiveNav();


/* =========================================
   REVEAL ON SCROLL
   ========================================= */

const revealItems = document.querySelectorAll(
    ".section-heading, " +
    ".about-content, " +
    ".about-card, " +
    ".skill-card, " +
    ".project-card, " +
    ".journey-step, " +
    ".education-card, " +
    ".certification-card, " +
    ".contact-content"
);


if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    revealItems.forEach((item) => {

        revealObserver.observe(item);

    });

} else {

    revealItems.forEach((item) => {

        item.classList.add("visible");

    });

}


/* =========================================
   TERMINAL CURSOR
   ========================================= */

const cursor =
    document.querySelector(".cursor");

if (cursor) {

    setInterval(() => {

        cursor.style.opacity =
            cursor.style.opacity === "0"
                ? "1"
                : "0";

    }, 600);

}


/* =========================================
   QR CODE
   ========================================= */

const qrButton =
    document.getElementById("qr-button");

const qrModal =
    document.getElementById("qr-modal");

const qrClose =
    document.getElementById("qr-close");

const qrWrapper =
    document.getElementById("qr-code-wrapper");

const qrShare =
    document.getElementById("qr-share");

const qrDownload =
    document.getElementById("qr-download");


/*
    Automatically gets the current page URL.

    Example:

    Local:
    http://127.0.0.1:5500/

    After Netlify:
    https://your-portfolio.netlify.app/

    No URL needs to be hard-coded.
*/

const portfolioURL =
    window.location.href.split("#")[0];


let qrGenerated = false;


/* =========================================
   GENERATE QR CODE
   ========================================= */

function generateQRCode() {

    if (!qrWrapper) {
        return false;
    }


    if (typeof QRCode === "undefined") {

        qrWrapper.innerHTML = `
            <div class="qr-loading">
                QR library failed to load.
            </div>
        `;

        return false;

    }


    qrWrapper.innerHTML = "";


    new QRCode(qrWrapper, {

        text: portfolioURL,

        width: 200,

        height: 200,

        colorDark: "#000000",

        colorLight: "#ffffff",

        correctLevel:
            QRCode.CorrectLevel.H

    });


    qrGenerated = true;

    return true;

}


/* =========================================
   OPEN QR MODAL
   ========================================= */

function openQRModal() {

    if (!qrModal) {
        return;
    }


    if (!qrGenerated) {

        generateQRCode();

    }


    qrModal.classList.add(
        "active"
    );


    qrModal.setAttribute(
        "aria-hidden",
        "false"
    );


    /*
        Prevent the page behind the
        popup from scrolling.
    */

    document.body.style.overflow =
        "hidden";


    /*
        Move keyboard focus to
        close button.
    */

    setTimeout(() => {

        if (qrClose) {
            qrClose.focus();
        }

    }, 50);

}


/* =========================================
   CLOSE QR MODAL
   ========================================= */

function closeQRModal() {

    if (!qrModal) {
        return;
    }


    qrModal.classList.remove(
        "active"
    );


    qrModal.setAttribute(
        "aria-hidden",
        "true"
    );


    /*
        Restore page scrolling.
    */

    document.body.style.overflow =
        "";


    /*
        Return focus to QR button.
    */

    if (qrButton) {
        qrButton.focus();
    }

}


/* =========================================
   QR BUTTON CLICK
   ========================================= */

if (qrButton) {

    qrButton.addEventListener(
        "click",
        openQRModal
    );

}


/* =========================================
   CLOSE BUTTON CLICK
   ========================================= */

if (qrClose) {

    qrClose.addEventListener(
        "click",
        closeQRModal
    );

}


/* =========================================
   CLICK OUTSIDE POPUP
   ========================================= */

if (qrModal) {

    qrModal.addEventListener(
        "click",
        (event) => {

            /*
                Only close when the dark
                background is clicked.

                Clicking inside the popup
                will NOT close it.
            */

            if (
                event.target === qrModal
            ) {

                closeQRModal();

            }

        }
    );

}


/* =========================================
   ESCAPE KEY
   ========================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            qrModal &&
            qrModal.classList.contains("active")
        ) {

            closeQRModal();

        }

    }
);


/* =========================================
   QR DOWNLOAD
   ========================================= */

if (qrDownload) {

    qrDownload.addEventListener(
        "click",
        () => {

            /*
                Generate QR if it hasn't
                already been generated.
            */

            if (!qrGenerated) {

                generateQRCode();

            }


            const canvas =
                qrWrapper?.querySelector(
                    "canvas"
                );


            const image =
                qrWrapper?.querySelector(
                    "img"
                );


            /*
                Preferred method:
                Download canvas as PNG.
            */

            if (canvas) {

                const link =
                    document.createElement(
                        "a"
                    );


                link.href =
                    canvas.toDataURL(
                        "image/png"
                    );


                link.download =
                    "nishanth-portfolio-qr.png";


                document.body.appendChild(
                    link
                );


                link.click();


                link.remove();


                return;

            }


            /*
                Fallback if QRCode.js
                generated an image instead.
            */

            if (image) {

                const link =
                    document.createElement(
                        "a"
                    );


                link.href =
                    image.src;


                link.download =
                    "nishanth-portfolio-qr.png";


                document.body.appendChild(
                    link
                );


                link.click();


                link.remove();

            }

        }
    );

}


/* =========================================
   QR SHARE
   ========================================= */

if (qrShare) {

    qrShare.addEventListener(
        "click",
        async () => {

            const originalText =
                qrShare.textContent;


            try {

                /*
                    First try native sharing
                    with the QR image.

                    This works especially well
                    on supported mobile browsers.
                */

                const canvas =
                    qrWrapper?.querySelector(
                        "canvas"
                    );


                if (
                    navigator.share &&
                    canvas &&
                    canvas.toBlob
                ) {

                    const blob =
                        await new Promise(
                            (resolve) => {

                                canvas.toBlob(
                                    resolve,
                                    "image/png"
                                );

                            }
                        );


                    if (blob) {

                        const file =
                            new File(
                                [
                                    blob
                                ],
                                "nishanth-portfolio-qr.png",
                                {
                                    type:
                                        "image/png"
                                }
                            );


                        /*
                            Check whether the
                            browser supports
                            sharing files.
                        */

                        if (
                            navigator.canShare &&
                            navigator.canShare({
                                files: [file]
                            })
                        ) {

                            await navigator.share({

                                title:
                                    "Nishanth J | Portfolio",

                                text:
                                    "Scan my portfolio QR code.",

                                files: [file]

                            });


                            return;

                        }

                    }

                }


                /*
                    If QR image sharing is not
                    supported, share the URL.
                */

                if (navigator.share) {

                    await navigator.share({

                        title:
                            "Nishanth J | Portfolio",

                        text:
                            "Check out my portfolio.",

                        url:
                            portfolioURL

                    });


                    return;

                }


                /*
                    Desktop fallback:
                    copy portfolio URL.
                */

                if (navigator.clipboard) {

                    await navigator.clipboard
                        .writeText(
                            portfolioURL
                        );


                    qrShare.textContent =
                        "Link Copied!";


                    setTimeout(() => {

                        qrShare.textContent =
                            originalText;

                    }, 1800);


                    return;

                }


                /*
                    Final fallback.
                */

                alert(
                    `Portfolio link:\n${portfolioURL}`
                );


            } catch (error) {

                /*
                    User pressing Cancel
                    on native share is not
                    treated as an error.
                */

                if (
                    error?.name ===
                    "AbortError"
                ) {

                    return;

                }


                /*
                    Try clipboard as
                    final fallback.
                */

                try {

                    await navigator.clipboard
                        .writeText(
                            portfolioURL
                        );


                    qrShare.textContent =
                        "Link Copied!";


                    setTimeout(() => {

                        qrShare.textContent =
                            originalText;

                    }, 1800);


                } catch {

                    alert(
                        `Portfolio link:\n${portfolioURL}`
                    );

                }

            }

        }
    );

}


/* =========================================
   CURRENT YEAR
   ========================================= */

const yearElement =
    document.querySelector(
        ".site-footer p"
    );


if (yearElement) {

    yearElement.textContent =
        `© ${new Date().getFullYear()} Nishanth J`;

}