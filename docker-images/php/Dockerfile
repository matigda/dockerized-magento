FROM php:7.1.25-fpm

# Install
RUN buildDeps=" \
        libpng-dev \
        libjpeg-dev \
        libmcrypt-dev \
        libxml2-dev \
        libfreetype6-dev \
        freetype* \
    "; \
    set -x \
    && apt-get update && apt-get install -y $buildDeps --no-install-recommends && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-configure \
    gd --with-png-dir=/usr --with-jpeg-dir=/usr --with-freetype-dir \
    && docker-php-ext-install \
    gd \
    mbstring \
    mysqli \
    mcrypt \
    mysqli \
    pdo_mysql \
    soap \
    zip \
    && apt-get update -qy && apt-get install -qy git-core \
    && cd /tmp/ && git clone https://github.com/derickr/xdebug.git \
    && cd xdebug && phpize && ./configure --enable-xdebug && make \
    && mkdir /usr/lib/php5/ && cp modules/xdebug.so /usr/lib/php5/xdebug.so \
    && touch /usr/local/etc/php/ext-xdebug.ini \
    && rm -r /tmp/xdebug && apt-get purge -y git-core \
    && apt-get purge -y --auto-remove

# Configure
COPY php.ini /usr/local/etc/php/php.ini
COPY php-fpm.conf /usr/local/etc/
COPY ext-xdebug.ini /usr/local/etc/php/conf.d/ext-xdebug.ini

# Make sure the volume mount point is empty
RUN rm -rf /var/www/html/*

# Install magerun
RUN curl -o magerun https://raw.githubusercontent.com/netz98/n98-magerun/master/n98-magerun.phar && \
    chmod +x ./magerun && \
    cp ./magerun /usr/local/bin/ && \
    rm ./magerun && \
    apt-get update && \
    apt-get install -qy mysql-client

RUN apt-get install -my wget gnupg

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -

RUN apt-get install -y nodejs


RUN apt-get -y install build-essential curl git python libglib2.0-dev \
    && cd /tmp \
    # Install depot_tools first (needed for source checkout)
    && git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git \
    && export PATH=`pwd`/depot_tools:"$PATH" \
    # Download v8
    && fetch v8

RUN apt-get -y install ninja-build

RUN cd /tmp/v8 \
    # Setup GN
    && tools/dev/v8gen.py -vv x64.release -- is_component_build=true  \
    # Build
    && ninja -C out.gn/x64.release/

    # Install to /opt/v8/
RUN mkdir -p /opt/v8/lib && mkdir -p /opt/v8/include
RUN cp /tmp/v8/out.gn/x64.release/lib*.so /tmp/v8/out.gn/x64.release/*_blob.bin \
      /tmp/v8/out.gn/x64.release/icudtl.dat /opt/v8/lib/ \
    && cp -R /tmp/v8/include/* /opt/v8/include/

RUN cd /tmp \
    && git clone https://github.com/phpv8/v8js.git \
    && cd v8js \
    && phpize \
    && ./configure --with-v8js=/opt/v8 LDFLAGS="-lstdc++" \
    && make \
    && make install