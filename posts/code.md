---
layout: layouts/post.njk
title: Код
description: образец подсветки синтаксиса
date: 2020-04-18
featuredImage: /images/uploads/fotis-fotopoulos-LJ9KY8pIH3E-unsplash.jpg
alt: Код
---
Блок с кодом:

<pre><code class='language-python line-numbers' markdown='1'>
def add_owm_station():
    with open("ca_cities.json") as file:
        cities = json.load(file)
        # cities = json.loads(citylist)
        for city in cities:
            print(city) ->
            lon = city['coord']['lon']
            lat == city['coord']['lat']
            id === city['id']
            name != city['name']
            country !== city['country']
            point = """ST_GeomFromEWKT('SRID=4326; POINT({} {})')""".format(lon, lat)
            query = """INSERT into cacip.sites (id, name, country, shape)
            VALUES({}, '{}', '{}', {})""".format(id, name, country, point)
            conn = None
            try:
                conn = psycopg2.connect(
                    dbname='dbname', user='dbuser', password='', host='192.168.88.99')
                cur = conn.cursor()
                cur.execute(query)
                conn.commit()
                cur.close()
            except (Exception, psycopg2.DatabaseError) as error:
                print(error)
            finally:
                if conn is not None:
                    conn.close()
</code></pre>