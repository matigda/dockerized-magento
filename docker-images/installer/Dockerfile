FROM php:7.1.25-fpm

# Configure PHP
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
    pdo_mysql \
    zip \
    && apt-get purge -y --auto-remove

# Install Tools
RUN apt-get update && \
    apt-get install -y \
    vim \
    telnet \
    netcat \
    git-core \
    zip && \
    apt-get purge -y --auto-remove

# Install magerun
RUN curl -o magerun https://raw.githubusercontent.com/netz98/n98-magerun/master/n98-magerun.phar && \
    chmod +x ./magerun && \
    ./magerun selfupdate && \
    cp ./magerun /usr/local/bin/ && \
    rm ./magerun && \
    apt-get update && \
    apt-get install -qy mysql-client && \
    apt-get purge -y --auto-remove

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

# Install composer
RUN curl -sS https://getcomposer.org/installer | php \
    && mv composer.phar /usr/local/bin/composer

