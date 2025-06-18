FROM php:8.1-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install AWS SDK for PHP (for MinIO)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer require aws/aws-sdk-php

# Set working directory
WORKDIR /var/www

# Create uploads directory with proper permissions
RUN mkdir -p /var/www/uploads && chmod -R 777 /var/www/uploads

# Expose port 9000 and start php-fpm server
EXPOSE 9000
CMD ["php-fpm"]