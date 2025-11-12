import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const Index = () => {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [roomType, setRoomType] = useState<string>('');
  const [activeSection, setActiveSection] = useState('home');

  const rooms = [
    {
      id: 1,
      name: 'Стандартный номер',
      price: 5000,
      image: 'https://cdn.poehali.dev/projects/55bff186-b583-400e-948c-0d58a6f0eb53/files/fcea5790-d250-4f1b-97a5-9c227ff8c224.jpg',
      description: 'Уютный номер с видом на город, двуспальной кроватью и современными удобствами',
      size: 25,
      guests: 2
    },
    {
      id: 2,
      name: 'Делюкс номер',
      price: 8000,
      image: 'https://cdn.poehali.dev/projects/55bff186-b583-400e-948c-0d58a6f0eb53/files/fcea5790-d250-4f1b-97a5-9c227ff8c224.jpg',
      description: 'Просторный номер с панорамным видом, зоной отдыха и роскошной ванной комнатой',
      size: 35,
      guests: 2
    },
    {
      id: 3,
      name: 'Люкс',
      price: 12000,
      image: 'https://cdn.poehali.dev/projects/55bff186-b583-400e-948c-0d58a6f0eb53/files/fcea5790-d250-4f1b-97a5-9c227ff8c224.jpg',
      description: 'Роскошный люкс с отдельной гостиной, кухней и балконом с видом на город',
      size: 50,
      guests: 4
    }
  ];

  const services = [
    { icon: 'Wifi', title: 'Бесплатный Wi-Fi', desc: 'Высокоскоростной интернет во всех номерах' },
    { icon: 'Utensils', title: 'Ресторан', desc: 'Изысканная кухня от шеф-повара' },
    { icon: 'Dumbbell', title: 'Фитнес-центр', desc: 'Современный тренажёрный зал' },
    { icon: 'Car', title: 'Парковка', desc: 'Бесплатная охраняемая парковка' },
    { icon: 'Waves', title: 'Бассейн', desc: 'Крытый бассейн с подогревом' },
    { icon: 'Sparkles', title: 'СПА-центр', desc: 'Массаж и косметические процедуры' }
  ];

  const reviews = [
    { name: 'Анна Петрова', rating: 5, text: 'Прекрасный отель! Отличный сервис, чистые номера и вкусная еда. Обязательно вернёмся!' },
    { name: 'Дмитрий Иванов', rating: 5, text: 'Идеальное место для отдыха. Персонал очень внимательный, номера комфортные.' },
    { name: 'Елена Смирнова', rating: 4, text: 'Хороший отель в центре города. Понравилось всё, кроме шума с улицы по утрам.' }
  ];

  const gallery = [
    'https://cdn.poehali.dev/projects/55bff186-b583-400e-948c-0d58a6f0eb53/files/da588a0d-703b-4abc-b83c-1cc03ca2b3bd.jpg',
    'https://cdn.poehali.dev/projects/55bff186-b583-400e-948c-0d58a6f0eb53/files/fcea5790-d250-4f1b-97a5-9c227ff8c224.jpg',
    'https://cdn.poehali.dev/projects/55bff186-b583-400e-948c-0d58a6f0eb53/files/fa29c024-30bf-4224-ae5f-d1b10c936b1a.jpg',
    'https://cdn.poehali.dev/projects/55bff186-b583-400e-948c-0d58a6f0eb53/files/da588a0d-703b-4abc-b83c-1cc03ca2b3bd.jpg'
  ];

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBooking = () => {
    if (checkIn && checkOut && roomType) {
      alert(`Бронирование:\nЗаезд: ${format(checkIn, 'dd.MM.yyyy', { locale: ru })}\nВыезд: ${format(checkOut, 'dd.MM.yyyy', { locale: ru })}\nНомер: ${roomType}`);
    } else {
      alert('Пожалуйста, заполните все поля');
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">LUXE HOTEL</h1>
            <div className="hidden md:flex gap-6">
              {['home', 'rooms', 'services', 'restaurant', 'gallery', 'reviews', 'contacts'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`text-sm font-medium transition-colors hover:text-accent ${
                    activeSection === section ? 'text-accent' : 'text-foreground'
                  }`}
                >
                  {section === 'home' && 'Главная'}
                  {section === 'rooms' && 'Номера'}
                  {section === 'services' && 'Услуги'}
                  {section === 'restaurant' && 'Ресторан'}
                  {section === 'gallery' && 'Галерея'}
                  {section === 'reviews' && 'Отзывы'}
                  {section === 'contacts' && 'Контакты'}
                </button>
              ))}
            </div>
            <Button onClick={() => scrollToSection('booking')} className="bg-accent hover:bg-accent/90">
              Забронировать
            </Button>
          </div>
        </div>
      </nav>

      <section id="home" className="h-screen relative flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://cdn.poehali.dev/projects/55bff186-b583-400e-948c-0d58a6f0eb53/files/da588a0d-703b-4abc-b83c-1cc03ca2b3bd.jpg')`
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 text-center text-white px-4 animate-fade-in">
          <h2 className="text-6xl md:text-7xl font-bold mb-6">Роскошь и комфорт</h2>
          <p className="text-xl md:text-2xl mb-8 font-light">В сердце города</p>
          <Button
            size="lg"
            onClick={() => scrollToSection('rooms')}
            className="bg-accent hover:bg-accent/90 text-white text-lg px-8 py-6"
          >
            Выбрать номер
          </Button>
        </div>
      </section>

      <section id="rooms" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Номера</h2>
          <p className="text-center text-muted-foreground mb-12">Выберите идеальный номер для вашего отдыха</p>
          <div className="grid md:grid-cols-3 gap-8">
            {rooms.map((room, index) => (
              <Card
                key={room.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold mb-2">{room.name}</h3>
                  <p className="text-muted-foreground mb-4">{room.description}</p>
                  <div className="flex gap-4 mb-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name="Maximize" size={16} />
                      {room.size} м²
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Users" size={16} />
                      {room.guests} гостя
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-accent">{room.price} ₽</span>
                    <Button onClick={() => scrollToSection('booking')} className="bg-primary hover:bg-primary/90">
                      Забронировать
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Услуги</h2>
          <p className="text-center text-muted-foreground mb-12">Всё для вашего комфорта</p>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-lg hover:shadow-lg transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
                  <Icon name={service.icon} size={32} className="text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="restaurant" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ресторан</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Наш ресторан предлагает изысканные блюда европейской и азиатской кухни. Шеф-повар с мировым именем создаёт
                кулинарные шедевры из свежайших продуктов.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Icon name="Clock" className="text-accent" />
                  <span>Завтрак: 07:00 - 11:00</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Clock" className="text-accent" />
                  <span>Обед: 12:00 - 16:00</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Clock" className="text-accent" />
                  <span>Ужин: 18:00 - 23:00</span>
                </div>
              </div>
              <Button className="mt-8 bg-accent hover:bg-accent/90">Забронировать столик</Button>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden animate-scale-in">
              <img
                src="https://cdn.poehali.dev/projects/55bff186-b583-400e-948c-0d58a6f0eb53/files/fa29c024-30bf-4224-ae5f-d1b10c936b1a.jpg"
                alt="Ресторан"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Галерея</h2>
          <p className="text-center text-muted-foreground mb-12">Взгляните на наш отель</p>
          <div className="grid md:grid-cols-4 gap-4">
            {gallery.map((img, index) => (
              <div
                key={index}
                className="relative h-64 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img src={img} alt={`Галерея ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="booking" className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Бронирование</h2>
          <p className="text-center text-muted-foreground mb-12">Забронируйте номер прямо сейчас</p>
          <Card className="animate-scale-in">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Дата заезда</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Icon name="Calendar" className="mr-2" size={16} />
                        {checkIn ? format(checkIn, 'dd.MM.yyyy', { locale: ru }) : 'Выберите дату'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} locale={ru} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Дата выезда</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Icon name="Calendar" className="mr-2" size={16} />
                        {checkOut ? format(checkOut, 'dd.MM.yyyy', { locale: ru }) : 'Выберите дату'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} locale={ru} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Тип номера</label>
                <Select value={roomType} onValueChange={setRoomType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите номер" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.name}>
                        {room.name} - {room.price} ₽
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleBooking} className="w-full bg-accent hover:bg-accent/90" size="lg">
                Забронировать номер
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="reviews" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Отзывы</h2>
          <p className="text-center text-muted-foreground mb-12">Что говорят наши гости</p>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {reviews.map((review, index) => (
              <Card
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Icon key={i} name="Star" size={20} className="text-accent fill-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">{review.text}</p>
                  <p className="font-semibold">{review.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contacts" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Контакты</h2>
          <p className="text-center text-muted-foreground mb-12">Свяжитесь с нами</p>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Icon name="MapPin" className="text-accent" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Адрес</h3>
                  <p className="text-muted-foreground">г. Москва, ул. Тверская, д. 10</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Icon name="Phone" className="text-accent" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Телефон</h3>
                  <p className="text-muted-foreground">+7 (495) 123-45-67</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Icon name="Mail" className="text-accent" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-muted-foreground">info@luxehotel.ru</p>
                </div>
              </div>
            </div>
            <div className="h-80 bg-secondary/50 rounded-lg flex items-center justify-center animate-scale-in">
              <p className="text-muted-foreground">Карта отеля</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold mb-2">LUXE HOTEL</p>
          <p className="text-sm opacity-90">© 2024 Все права защищены</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
