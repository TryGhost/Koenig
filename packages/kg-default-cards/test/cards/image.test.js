// Switch these lines once there are useful utils
// const testUtils = require('./utils');
require('../utils');

const card = require('../../lib/cards/image');
const SimpleDom = require('simple-dom');
const serializer = new SimpleDom.HTMLSerializer(SimpleDom.voidMap);

describe('Image card', function () {
    it('renders an image', function () {
        let opts = {
            env: {
                dom: new SimpleDom.Document()
            },
            payload: {
                src: 'https://www.ghost.org/image.png'
            }
        };

        serializer.serialize(card.render(opts)).should.eql('<figure class="kg-card kg-image-card"><img src="https://www.ghost.org/image.png" class="kg-image" alt loading="lazy"></figure>');
    });

    it('renders an image with caption', function () {
        let opts = {
            env: {
                dom: new SimpleDom.Document()
            },
            payload: {
                src: 'https://www.ghost.org/image.png',
                caption: '<b>Test caption</b>'
            }
        };

        serializer.serialize(card.render(opts)).should.eql('<figure class="kg-card kg-image-card kg-card-hascaption"><img src="https://www.ghost.org/image.png" class="kg-image" alt loading="lazy"><figcaption><b>Test caption</b></figcaption></figure>');
    });

    it('renders an image with alt text', function () {
        let opts = {
            env: {
                dom: new SimpleDom.Document()
            },
            payload: {
                src: 'https://www.ghost.org/image.png',
                alt: 'example image'
            }
        };

        serializer.serialize(card.render(opts)).should.eql('<figure class="kg-card kg-image-card"><img src="https://www.ghost.org/image.png" class="kg-image" alt="example image" loading="lazy"></figure>');
    });

    it('renders an image with blank alt text', function () {
        let opts = {
            env: {
                dom: new SimpleDom.Document()
            },
            payload: {
                src: 'https://www.ghost.org/image.png'
            }
        };

        serializer.serialize(card.render(opts)).should.eql('<figure class="kg-card kg-image-card"><img src="https://www.ghost.org/image.png" class="kg-image" alt loading="lazy"></figure>');
    });

    it('renders an image with title attribute', function () {
        let opts = {
            env: {
                dom: new SimpleDom.Document()
            },
            payload: {
                src: 'https://www.ghost.org/image.png',
                title: 'example image'
            }
        };

        serializer.serialize(card.render(opts)).should.eql('<figure class="kg-card kg-image-card"><img src="https://www.ghost.org/image.png" class="kg-image" alt loading="lazy" title="example image"></figure>');
    });

    it('renders an image with a link', function () {
        let opts = {
            env: {
                dom: new SimpleDom.Document()
            },
            payload: {
                src: 'https://www.ghost.org/image.png',
                title: 'example image',
                href: 'https://example.com'
            }
        };

        serializer.serialize(card.render(opts)).should.eql('<figure class="kg-card kg-image-card"><a href="https://example.com"><img src="https://www.ghost.org/image.png" class="kg-image" alt loading="lazy" title="example image"></a></figure>');
    });

    it('renders nothing with no src', function () {
        let opts = {
            env: {
                dom: new SimpleDom.Document()
            },
            payload: {
                src: '',
                caption: 'Test caption'
            }
        };

        serializer.serialize(card.render(opts)).should.eql('');
    });

    describe('sizes', function () {
        it('standard', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: 'https://www.ghost.org/image.png',
                    cardWidth: ''
                }
            };

            serializer.serialize(card.render(opts))
                .should.containEql('<figure class="kg-card kg-image-card">');
        });

        it('wide', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: 'https://www.ghost.org/image.png',
                    cardWidth: 'wide'
                }
            };

            serializer.serialize(card.render(opts))
                .should.containEql('<figure class="kg-card kg-image-card kg-width-wide">');
        });

        it('full', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: 'https://www.ghost.org/image.png',
                    cardWidth: 'full'
                }
            };

            serializer.serialize(card.render(opts))
                .should.containEql('<figure class="kg-card kg-image-card kg-width-full">');
        });
    });

    describe('image dimensions', function () {
        it('includes width and height when available', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: '/content/images/2021/02/four-point-oh.png',
                    width: 3000,
                    height: 6000
                }
            };

            serializer.serialize(card.render(opts))
                .should.containEql('width="3000" height="6000"');
        });

        it('omits width and height when not available', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: '/content/images/2021/02/four-point-oh.png'
                }
            };

            const output = serializer.serialize(card.render(opts));

            output.should.not.containEql(' width="');
            output.should.not.containEql(' height="');
        });

        it('uses resized width and height when there\'s a max width', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: '/content/images/2021/02/four-point-oh.png',
                    width: 3000,
                    height: 6000
                },
                options: {
                    imageOptimization: {
                        defaultMaxWidth: 2000
                    },
                    canTransformImage: () => true
                }
            };

            serializer.serialize(card.render(opts))
                .should.containEql('width="2000" height="4000"');
        });

        it('uses original width and height when transform is not available', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: '/content/images/2021/02/four-point-oh.png',
                    width: 3000,
                    height: 6000
                },
                options: {
                    imageOptimization: {
                        defaultMaxWidth: 2000
                    },
                    canTransformImage: () => false
                }
            };

            serializer.serialize(card.render(opts))
                .should.containEql('width="3000" height="6000"');
        });
    });

    describe('srcset attribute', function () {
        it('is included when src is relative', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: '/content/images/2020/06/image.png',
                    width: 3000,
                    height: 6000
                },
                options: {
                    imageOptimization: {
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    }
                }
            };

            serializer.serialize(card.render(opts))
                .should.containEql('srcset="/content/images/size/w600/2020/06/image.png 600w, /content/images/size/w1000/2020/06/image.png 1000w, /content/images/size/w1600/2020/06/image.png 1600w, /content/images/size/w2400/2020/06/image.png 2400w"');
        });

        it('is included when src is __GHOST_URL__ relative', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: '__GHOST_URL__/content/images/2020/06/image.png',
                    width: 3000,
                    height: 6000
                },
                options: {
                    imageOptimization: {
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    }
                }
            };

            serializer.serialize(card.render(opts))
                .should.containEql('srcset="__GHOST_URL__/content/images/size/w600/2020/06/image.png 600w, __GHOST_URL__/content/images/size/w1000/2020/06/image.png 1000w, __GHOST_URL__/content/images/size/w1600/2020/06/image.png 1600w, __GHOST_URL__/content/images/size/w2400/2020/06/image.png 2400w"');
        });

        it('is included for absolute images', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: 'https://localhost:2368/content/images/2020/06/image.png',
                    width: 3000,
                    height: 2000
                },
                options: {
                    siteUrl: 'https://localhost:2368',
                    imageOptimization: {
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    }
                }
            };

            serializer.serialize(card.render(opts))
                .should.containEql('srcset="https://localhost:2368/content/images/size/w600/2020/06/image.png 600w, https://localhost:2368/content/images/size/w1000/2020/06/image.png 1000w, https://localhost:2368/content/images/size/w1600/2020/06/image.png 1600w, https://localhost:2368/content/images/size/w2400/2020/06/image.png 2400w"');
        });

        it('is included for absolute images when siteUrl has trailing slash', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: 'https://localhost:2368/content/images/2020/06/image.png',
                    width: 3000,
                    height: 2000
                },
                options: {
                    siteUrl: 'https://localhost:2368/',
                    imageOptimization: {
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    }
                }
            };

            serializer.serialize(card.render(opts))
                .should.containEql('srcset="https://localhost:2368/content/images/size/w600/2020/06/image.png 600w, https://localhost:2368/content/images/size/w1000/2020/06/image.png 1000w, https://localhost:2368/content/images/size/w1600/2020/06/image.png 1600w, https://localhost:2368/content/images/size/w2400/2020/06/image.png 2400w"');
        });

        it('is omitted when target === email', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: '/content/images/2020/06/image.png',
                    width: 3000,
                    height: 6000
                },
                options: {
                    imageOptimization: {
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    },
                    target: 'email'
                }
            };

            serializer.serialize(card.render(opts))
                .should.not.containEql('srcset=');
        });

        it('is omitted when no contentImageSizes are passed as options', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: '/content/images/2020/06/image.png',
                    width: 3000,
                    height: 6000
                },
                options: {}
            };

            serializer.serialize(card.render(opts))
                .should.not.containEql('srcset=');
        });

        it('is omitted when `srcsets: false` is passed in as an option', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: '/content/images/2020/06/image.png',
                    width: 3000,
                    height: 6000
                },
                options: {
                    imageOptimization: {
                        srcsets: false,
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    }
                }
            };

            serializer.serialize(card.render(opts))
                .should.not.containEql('srcset=');
        });

        it('is omitted when canTransformImages is provided and returns false', function () {
            const canTransformImage = () => false;

            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: '/content/images/2020/06/image.png',
                    width: 3000,
                    height: 6000
                },
                options: {
                    imageOptimization: {
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    },
                    canTransformImage
                }
            };

            serializer.serialize(card.render(opts))
                .should.not.containEql('srcset=');
        });

        it('is omitted when no width is provided', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: '/content/images/2020/06/image.png',
                    height: 6000
                },
                options: {
                    imageOptimization: {
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    }
                }
            };

            serializer.serialize(card.render(opts))
                .should.not.containEql('srcset=');
        });

        it('is omitted when image is smaller than minimum responsive width', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: '/content/images/2020/06/image.png',
                    width: 500,
                    height: 700
                },
                options: {
                    imageOptimization: {
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    }
                }
            };

            serializer.serialize(card.render(opts))
                .should.not.containEql('srcset=');
        });

        it('omits sizes larger than image width and includes original image width if smaller than largest responsive width', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: '/content/images/2020/06/image.png',
                    width: 750,
                    height: 300
                },
                options: {
                    imageOptimization: {
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    }
                }
            };

            serializer.serialize(card.render(opts))
                .should.containEql('srcset="/content/images/size/w600/2020/06/image.png 600w, /content/images/2020/06/image.png 750w"');
        });

        it('works correctly with subdirectories', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: '/subdir/content/images/2020/06/image.png',
                    width: 3000,
                    height: 6000
                },
                options: {
                    imageOptimization: {
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    }
                }
            };

            serializer.serialize(card.render(opts))
                .should.containEql('srcset="/subdir/content/images/size/w600/2020/06/image.png 600w, /subdir/content/images/size/w1000/2020/06/image.png 1000w, /subdir/content/images/size/w1600/2020/06/image.png 1600w, /subdir/content/images/size/w2400/2020/06/image.png 2400w"');
        });

        it('works correctly for absolute subdirectories', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: 'https://localhost:2368/blog/content/images/2020/06/image.png',
                    width: 3000,
                    height: 2000
                },
                options: {
                    siteUrl: 'https://localhost:2368/blog',
                    imageOptimization: {
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    }
                }
            };

            serializer.serialize(card.render(opts))
                .should.containEql('srcset="https://localhost:2368/blog/content/images/size/w600/2020/06/image.png 600w, https://localhost:2368/blog/content/images/size/w1000/2020/06/image.png 1000w, https://localhost:2368/blog/content/images/size/w1600/2020/06/image.png 1600w, https://localhost:2368/blog/content/images/size/w2400/2020/06/image.png 2400w"');
        });

        it('is included when src is an Unsplash image', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: 'https://images.unsplash.com/photo-1591672299888-e16a08b6c7ce?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ',
                    width: 3000,
                    height: 6000
                },
                options: {
                    imageOptimization: {
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    }
                }
            };

            // note that '&' in URLs will be rendered as '&amp;' to maintain HTML encoding
            serializer.serialize(card.render(opts))
                .should.containEql('srcset="https://images.unsplash.com/photo-1591672299888-e16a08b6c7ce?ixlib=rb-1.2.1&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb&amp;w=600&amp;fit=max&amp;ixid=eyJhcHBfaWQiOjExNzczfQ 600w, https://images.unsplash.com/photo-1591672299888-e16a08b6c7ce?ixlib=rb-1.2.1&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb&amp;w=1000&amp;fit=max&amp;ixid=eyJhcHBfaWQiOjExNzczfQ 1000w, https://images.unsplash.com/photo-1591672299888-e16a08b6c7ce?ixlib=rb-1.2.1&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb&amp;w=1600&amp;fit=max&amp;ixid=eyJhcHBfaWQiOjExNzczfQ 1600w, https://images.unsplash.com/photo-1591672299888-e16a08b6c7ce?ixlib=rb-1.2.1&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb&amp;w=2400&amp;fit=max&amp;ixid=eyJhcHBfaWQiOjExNzczfQ 2400w"');
        });

        it('has same size omission behaviour for Unsplash as local files', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: 'https://images.unsplash.com/photo-1591672299888-e16a08b6c7ce?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ',
                    width: 750,
                    height: 300
                },
                options: {
                    imageOptimization: {
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    }
                }
            };

            serializer.serialize(card.render(opts))
                .should.containEql('srcset="https://images.unsplash.com/photo-1591672299888-e16a08b6c7ce?ixlib=rb-1.2.1&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb&amp;w=600&amp;fit=max&amp;ixid=eyJhcHBfaWQiOjExNzczfQ 600w, https://images.unsplash.com/photo-1591672299888-e16a08b6c7ce?ixlib=rb-1.2.1&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb&amp;w=750&amp;fit=max&amp;ixid=eyJhcHBfaWQiOjExNzczfQ 750w"');
        });
    });

    describe('sizes attribute', function () {
        it('is added for standard images', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: '/content/images/2020/06/image.png',
                    width: 3000,
                    height: 2000
                },
                options: {
                    imageOptimization: {
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    }
                }
            };

            serializer.serialize(card.render(opts)).should.match(/sizes="\(min-width: 720px\) 720px"/);
        });

        it('is added for __GHOST_URL__ relative images', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: '__GHOST_URL__/content/images/2020/06/image.png',
                    width: 3000,
                    height: 2000
                },
                options: {
                    imageOptimization: {
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    }
                }
            };

            serializer.serialize(card.render(opts)).should.match(/sizes="\(min-width: 720px\) 720px"/);
        });

        it('is added for absolute images', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: 'https://localhost:2368/content/images/2020/06/image.png',
                    width: 3000,
                    height: 2000
                },
                options: {
                    siteUrl: 'https://localhost:2368',
                    imageOptimization: {
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    }
                }
            };

            serializer.serialize(card.render(opts)).should.match(/sizes="\(min-width: 720px\) 720px"/);
        });

        it('is added for absolute images when siteUrl has trailing slash', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: 'https://localhost:2368/content/images/2020/06/image.png',
                    width: 3000,
                    height: 2000
                },
                options: {
                    siteUrl: 'https://localhost:2368/',
                    imageOptimization: {
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    }
                }
            };

            serializer.serialize(card.render(opts)).should.match(/sizes="\(min-width: 720px\) 720px"/);
        });

        it('is added for wide images', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: '/content/images/2020/06/image.png',
                    width: 3000,
                    height: 2000,
                    cardWidth: 'wide'
                },
                options: {
                    imageOptimization: {
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    }
                }
            };

            serializer.serialize(card.render(opts)).should.match(/sizes="\(min-width: 1200px\) 1200px"/);
        });

        it('is omitted when srcset is not added', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: '/content/images/2020/06/image.png',
                    width: 3000,
                    height: 2000
                },
                options: {
                    imageOptimization: {
                        srcsets: false,
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    }
                }
            };

            serializer.serialize(card.render(opts)).should.not.match(/sizes="/);
        });

        it('is omitted when width is missing', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: '/content/images/2020/06/image.png',
                    // width: 3000,
                    height: 2000
                },
                options: {
                    imageOptimization: {
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    }
                }
            };

            serializer.serialize(card.render(opts)).should.not.match(/sizes="/);
        });

        it('is included when only height is missing', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: '/content/images/2020/06/image.png',
                    width: 3000
                    // height: 2000
                },
                options: {
                    imageOptimization: {
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    }
                }
            };

            serializer.serialize(card.render(opts)).should.match(/sizes="\(min-width: 720px\) 720px"/);
        });

        it('is omitted for standard images when width is less than 720', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: '/content/images/2020/06/image.png',
                    width: 640,
                    height: 480
                },
                options: {
                    imageOptimization: {
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    }
                }
            };

            serializer.serialize(card.render(opts)).should.not.match(/sizes="/);
        });

        it('is omitted for wide images when width is less than 1200', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: '/content/images/2020/06/image.png',
                    width: 900,
                    height: 600,
                    cardWidth: 'wide'
                },
                options: {
                    imageOptimization: {
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    }
                }
            };

            serializer.serialize(card.render(opts)).should.not.match(/sizes="/);
        });

        it('is omitted for full images', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: '/content/images/2020/06/image.png',
                    width: 3000,
                    height: 2000,
                    cardWidth: 'full'
                },
                options: {
                    imageOptimization: {
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    }
                }
            };

            serializer.serialize(card.render(opts)).should.not.match(/sizes="/);
        });
    });

    describe('email target', function () {
        it('adds width/height and uses resized local image', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: '/content/images/2020/06/image.png',
                    width: 3000,
                    height: 2000
                },
                options: {
                    target: 'email',
                    canTransformImage: () => true,
                    imageOptimization: {
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    }
                }
            };

            const output = serializer.serialize(card.render(opts));

            output.should.match(/width="600"/);
            output.should.match(/height="400"/);
            output.should.match(/\/content\/images\/size\/w1600\/2020\/06\/image\.png/);
        });

        it('adds width/height and uses resized unsplash image', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: 'https://images.unsplash.com/test.jpg',
                    width: 3000,
                    height: 2000
                },
                options: {
                    target: 'email'
                }
            };

            const output = serializer.serialize(card.render(opts));

            output.should.match(/width="600"/);
            output.should.match(/height="400"/);
            output.should.match(/images\.unsplash\.com\/test\.jpg\?w=1200/);
        });

        it('adds width/height and uses original src when local image can\'t be transformed', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: '/content/images/2020/06/image.png',
                    width: 3000,
                    height: 2000
                },
                options: {
                    target: 'email',
                    canTransformImage: () => false,
                    imageOptimization: {
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    }
                }
            };

            const output = serializer.serialize(card.render(opts));

            output.should.match(/width="600"/);
            output.should.match(/height="400"/);
            output.should.match(/\/content\/images\/2020\/06\/image\.png/);
            output.should.not.match(/\/content\/images\/size\/w1600\/2020\/06\/image\.png/);
        });

        it('uses original image if size is smaller than "retina" size', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: '/content/images/2020/06/image.png',
                    width: 800,
                    height: 533
                },
                options: {
                    target: 'email',
                    canTransformImage: () => true,
                    imageOptimization: {
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    }
                }
            };

            const output = serializer.serialize(card.render(opts));

            output.should.match(/width="600"/);
            output.should.match(/height="400"/);
            output.should.match(/\/content\/images\/2020\/06\/image\.png/);
        });

        it('uses original image width/height if image is smaller than 600px wide', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: '/content/images/2020/06/image.png',
                    width: 450,
                    height: 300
                },
                options: {
                    target: 'email',
                    canTransformImage: () => true,
                    imageOptimization: {
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    }
                }
            };

            const output = serializer.serialize(card.render(opts));

            output.should.match(/width="450"/);
            output.should.match(/height="300"/);
            output.should.match(/\/content\/images\/2020\/06\/image\.png/);
        });

        it('skips width/height and resize if payload is missing dimensions', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: '/content/images/2020/06/image.png'
                },
                options: {
                    target: 'email',
                    canTransformImage: () => true,
                    imageOptimization: {
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    }
                }
            };

            const output = serializer.serialize(card.render(opts));

            output.should.not.match(/width="/);
            output.should.not.match(/height="/);
            output.should.match(/\/content\/images\/2020\/06\/image\.png/);
        });

        it('resizes Unsplash images even if width/height data is missing', function () {
            let opts = {
                env: {
                    dom: new SimpleDom.Document()
                },
                payload: {
                    src: 'https://images.unsplash.com/test.jpg'
                },
                options: {
                    target: 'email',
                    canTransformImage: () => true,
                    imageOptimization: {
                        contentImageSizes: {
                            w600: {width: 600},
                            w1000: {width: 1000},
                            w1600: {width: 1600},
                            w2400: {width: 2400}
                        }
                    }
                }
            };

            const output = serializer.serialize(card.render(opts));

            output.should.match(/test\.jpg\?w=1200/);
        });
    });

    it('transforms urls absolute to relative', function () {
        let payload = {
            src: 'http://127.0.0.1:2369/content/images/2018/08/NatGeo01-9.jpg',
            caption: 'A link to <a href="http://127.0.0.1:2369/post">an internal post</a>'
        };

        const transformed = card.absoluteToRelative(payload, {siteUrl: 'http://127.0.0.1:2369/'});

        transformed.src
            .should.equal('/content/images/2018/08/NatGeo01-9.jpg');

        transformed.caption
            .should.equal('A link to <a href="/post">an internal post</a>');
    });

    it('transforms urls relative to absolute', function () {
        let payload = {
            src: '/content/images/2018/08/NatGeo01-9.jpg',
            caption: 'A link to <a href="/post">an internal post</a>'
        };

        const transformed = card.relativeToAbsolute(payload, {siteUrl: 'http://127.0.0.1:2369/', itemUrl: 'http://127.0.0.1:2369/post'});

        transformed.src
            .should.equal('http://127.0.0.1:2369/content/images/2018/08/NatGeo01-9.jpg');

        transformed.caption
            .should.equal('A link to <a href="http://127.0.0.1:2369/post">an internal post</a>');
    });
});
